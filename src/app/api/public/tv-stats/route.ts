import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // 1. Overall Standings (Medals & Points)
        const colors = await prisma.color.findMany({
            include: {
                eventResults: {
                    select: { rank: true, points: true }
                }
            },
            orderBy: { totalScore: 'desc' }
        })

        const standings = colors.map(color => {
            const results = color.eventResults || []
            return {
                id: color.id,
                name: color.name,
                hexCode: color.hexCode,
                totalScore: color.totalScore,
                gold: results.filter(r => r.rank === 1).length,
                silver: results.filter(r => r.rank === 2).length,
                bronze: results.filter(r => r.rank === 3).length,
            }
        })

        // 2. Ongoing & Upcoming Events
        const ongoingEvents = await prisma.event.findMany({
            where: { status: 'ONGOING' },
            include: { sportType: { select: { name: true } } },
            take: 3
        })

        const upcomingEvents = await prisma.event.findMany({
            where: { status: 'UPCOMING' },
            include: { sportType: { select: { name: true } } },
            orderBy: { date: 'asc' },
            take: 3
        })

        // 3. Recent 10 Results for ticker
        const recentResults = await prisma.eventResult.findMany({
            take: 10,
            orderBy: { recordedAt: 'desc' },
            include: {
                event: { select: { name: true } },
                color: { select: { name: true, hexCode: true } },
                athlete: { select: { firstName: true, nickname: true } }
            }
        })

        // 4. Vote Standings (Top 5 popular athletes)
        const topVoted = await prisma.athlete.findMany({
            include: {
                _count: { select: { votes: true } },
                color: { select: { name: true, hexCode: true } }
            },
            orderBy: { votes: { _count: 'desc' } },
            take: 5
        })

        return NextResponse.json({
            standings,
            ongoingEvents,
            upcomingEvents,
            recentResults,
            topVoted: topVoted.map(a => ({
                id: a.id,
                name: `${a.firstName} (${a.nickname || a.lastName})`,
                color: a.color,
                votes: a._count.votes
            }))
        })
    } catch (error) {
        console.error('[TV_STATS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
