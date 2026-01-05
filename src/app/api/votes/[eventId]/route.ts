import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { voteSchema } from '@/lib/validations'

// GET /api/votes/[eventId] - List votes for event
export async function GET(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth()
        // Only Admin or Organizer can see full list of votes
        if (!session || !['ADMIN', 'ORGANIZER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const eventId = (await params).eventId
        const votes = await prisma.vote.findMany({
            where: { eventId },
            include: {
                athlete: { select: { firstName: true, lastName: true, nickname: true } },
                voter: { select: { username: true } },
            },
            orderBy: { votedAt: 'desc' },
        })

        return NextResponse.json(votes)
    } catch (error: any) {
        console.error('[VOTES_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/votes/[eventId] - Cast vote
export async function POST(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบเพื่อโหวต' }, { status: 401 })
        }

        const eventId = (await params).eventId
        const body = await req.json()
        const { athleteId, reason } = voteSchema.parse(body)

        // 1. Get settings
        let settings = await prisma.voteSetting.findUnique({
            where: { eventId },
        })

        if (!settings) {
            settings = await prisma.voteSetting.findFirst({
                where: { eventId: null },
            })
        }

        // 2. Validate settings
        if (!settings || !settings.votingEnabled) {
            return NextResponse.json({ error: 'ระบบโหวตยังไม่เปิดใช้งาน' }, { status: 400 })
        }

        const now = new Date()
        if (settings.votingStart && now < settings.votingStart) {
            return NextResponse.json({ error: 'การโหวตยังไม่เริ่มขึ้น' }, { status: 400 })
        }
        if (settings.votingEnd && now > settings.votingEnd) {
            return NextResponse.json({ error: 'สิ้นสุดเวลาโหวตแล้ว' }, { status: 400 })
        }

        // 3. Check vote count for this user
        const userVotesCount = await prisma.vote.count({
            where: {
                eventId,
                voterUserId: session.user.id,
                isValid: true,
            },
        })

        if (userVotesCount >= settings.maxVotesPerUser) {
            return NextResponse.json(
                { error: `คุณโหวตได้สูงสุด ${settings.maxVotesPerUser} ครั้งต่อรายการเท่านั้น` },
                { status: 400 }
            )
        }

        // 4. Record vote in transaction
        const result = await prisma.$transaction(async (tx) => {
            const vote = await tx.vote.create({
                data: {
                    eventId,
                    athleteId,
                    voterUserId: session.user.id,
                    voteReason: reason,
                },
            })

            // Update summary
            await tx.athleteVoteSummary.upsert({
                where: {
                    athleteId_eventId: { athleteId, eventId },
                },
                update: { totalVotes: { increment: 1 } },
                create: { athleteId, eventId, totalVotes: 1 },
            })

            return vote
        })

        return NextResponse.json({
            message: 'โหวตสำเร็จแล้ว',
            vote: result,
        })

    } catch (error: any) {
        console.error('[VOTE_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
