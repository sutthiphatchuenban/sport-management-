import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const [
            userCount,
            eventCount,
            athleteCount,
            voteCount,
            recentLogs,
            ongoingEvents,
            teamScores
        ] = await Promise.all([
            prisma.user.count(),
            prisma.event.count(),
            prisma.athlete.count(),
            prisma.vote.count(),
            prisma.activityLog.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { username: true } } }
            }),
            prisma.event.count({
                where: { status: 'ONGOING' }
            }),
            prisma.color.findMany({
                select: {
                    name: true,
                    hexCode: true,
                    eventResults: {
                        select: { points: true }
                    }
                }
            })
        ])

        // Process team scores
        const teamStats = teamScores.map((color: any) => ({
            name: color.name,
            hexCode: color.hexCode,
            score: color.eventResults.reduce((acc: number, curr: any) => acc + curr.points, 0)
        })).sort((a: any, b: any) => b.score - a.score)

        return NextResponse.json({
            summary: {
                users: userCount,
                events: eventCount,
                athletes: athleteCount,
                votes: voteCount,
                ongoingEvents
            },
            recentLogs,
            teamStats
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
