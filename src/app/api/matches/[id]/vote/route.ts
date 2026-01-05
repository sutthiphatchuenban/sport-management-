import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for voting
const voteSchema = z.object({
    athleteId: z.string().min(1, 'กรุณาเลือกนักกีฬา'),
    reason: z.string().optional(),
})

// POST /api/matches/[id]/vote - Vote for an athlete in this match
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const body = await req.json()
        const validated = voteSchema.parse(body)

        // Get session and IP
        const session = await auth()
        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

        // Get match details
        const match = await prisma.match.findUnique({
            where: { id },
            include: { event: { include: { voteSettings: true } } }
        })

        if (!match) {
            return NextResponse.json({ error: 'ไม่พบแมตช์' }, { status: 404 })
        }

        // Check if voting is enabled
        const voteSettings = match.event.voteSettings
        if (voteSettings && !voteSettings.votingEnabled) {
            return NextResponse.json({ error: 'ระบบโหวตปิดอยู่' }, { status: 400 })
        }

        // Check voting time
        if (voteSettings?.votingStart && new Date() < voteSettings.votingStart) {
            return NextResponse.json({ error: 'ยังไม่ถึงเวลาโหวต' }, { status: 400 })
        }
        if (voteSettings?.votingEnd && new Date() > voteSettings.votingEnd) {
            return NextResponse.json({ error: 'หมดเวลาโหวตแล้ว' }, { status: 400 })
        }

        // Check if athlete is in this match
        const isParticipant = await prisma.matchParticipant.findFirst({
            where: {
                matchId: id,
                athleteId: validated.athleteId
            }
        })

        if (!isParticipant) {
            return NextResponse.json({ error: 'นักกีฬาไม่ได้ลงแข่งในแมตช์นี้' }, { status: 400 })
        }

        // Check if already voted (by IP or user)
        const maxVotes = voteSettings?.maxVotesPerUser || 1

        const existingVotes = await prisma.vote.count({
            where: {
                matchId: id,
                OR: [
                    { voterIp: ip },
                    ...(session?.user?.id ? [{ voterUserId: session.user.id }] : [])
                ]
            }
        })

        if (existingVotes >= maxVotes) {
            return NextResponse.json({ error: 'คุณโหวตครบจำนวนที่กำหนดแล้ว' }, { status: 400 })
        }

        // Create vote
        const vote = await prisma.vote.create({
            data: {
                eventId: match.eventId,
                matchId: id,
                athleteId: validated.athleteId,
                voterIp: ip,
                voterUserId: session?.user?.id,
                voteReason: validated.reason,
            },
            include: {
                athlete: { select: { firstName: true, lastName: true } }
            }
        })

        return NextResponse.json({
            success: true,
            message: `โหวตให้ ${vote.athlete.firstName} ${vote.athlete.lastName} เรียบร้อยแล้ว!`,
            vote
        })
    } catch (error: any) {
        console.error('[MATCH_VOTE_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// GET /api/matches/[id]/vote - Get vote statistics for this match
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                event: { include: { voteSettings: true } },
                participants: {
                    include: {
                        athlete: {
                            select: { id: true, firstName: true, lastName: true, photoUrl: true }
                        },
                        color: { select: { id: true, name: true, hexCode: true } }
                    }
                }
            }
        })

        if (!match) {
            return NextResponse.json({ error: 'ไม่พบแมตช์' }, { status: 404 })
        }

        // Get vote counts
        const voteCounts = await prisma.vote.groupBy({
            by: ['athleteId'],
            where: { matchId: id, isValid: true },
            _count: { athleteId: true }
        })

        // Map to participants
        const stats = match.participants.map(p => {
            const voteData = voteCounts.find(v => v.athleteId === p.athleteId)
            return {
                athleteId: p.athleteId,
                athlete: p.athlete,
                color: p.color,
                votes: voteData?._count.athleteId || 0
            }
        }).sort((a, b) => b.votes - a.votes)

        // Add rank
        let currentRank = 1
        let prevVotes = -1
        const rankedStats = stats.map((s, i) => {
            if (s.votes !== prevVotes) {
                currentRank = i + 1
            }
            prevVotes = s.votes
            return { ...s, rank: currentRank }
        })

        const totalVotes = voteCounts.reduce((sum, v) => sum + v._count.athleteId, 0)

        return NextResponse.json({
            matchId: id,
            showResults: match.event.voteSettings?.showRealtimeResults ?? true,
            totalVotes,
            stats: rankedStats
        })
    } catch (error: any) {
        console.error('[MATCH_VOTE_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
