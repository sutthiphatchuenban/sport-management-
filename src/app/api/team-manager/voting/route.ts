import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEAM_MANAGER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const colorId = session.user.colorId
        if (!colorId) {
            return NextResponse.json({ error: 'User not associated with a team' }, { status: 400 })
        }

        // 1. Top Voted Athletes in this Team
        const topAthletes = await prisma.athlete.findMany({
            where: { colorId },
            include: {
                _count: { select: { votes: true } },
                major: { select: { name: true } }
            },
            orderBy: {
                votes: { _count: 'desc' }
            },
            take: 10
        })

        // 2. Vote distribution by Event for this Team
        // We aggregate votes where the athlete belongs to this colorId
        const votesByEvent = await prisma.vote.groupBy({
            by: ['eventId'],
            where: {
                athlete: { colorId }
            },
            _count: { _all: true }
        })

        const eventStats = await Promise.all(
            votesByEvent.map(async (v) => {
                const event = await prisma.event.findUnique({
                    where: { id: v.eventId },
                    select: { name: true, sportType: { select: { name: true } } }
                })
                return {
                    id: v.eventId,
                    name: event?.name,
                    sportType: event?.sportType.name,
                    count: v._count._all
                }
            })
        )

        // 3. Total votes for this team
        const totalVotes = await prisma.vote.count({
            where: { athlete: { colorId } }
        })

        return NextResponse.json({
            topAthletes: topAthletes.map(a => ({
                id: a.id,
                name: `${a.firstName} (${a.nickname || a.lastName})`,
                major: a.major.name,
                voteCount: a._count.votes
            })),
            eventStats: eventStats.sort((a, b) => b.count - a.count),
            summary: {
                totalTeamVotes: totalVotes
            }
        })
    } catch (error) {
        console.error('[TEAM_VOTING_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
