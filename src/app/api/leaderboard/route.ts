import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/leaderboard - Get current team standings with breakdown
export async function GET() {
    try {
        const leaderboard = await prisma.color.findMany({
            select: {
                id: true,
                name: true,
                hexCode: true,
                totalScore: true,
                _count: {
                    select: {
                        majors: true,
                        athletes: true,
                        eventResults: { where: { rank: 1 } }, // Count gold medals
                    }
                },
                eventResults: {
                    include: {
                        event: {
                            select: { name: true, sportType: { select: { name: true, category: true } } }
                        }
                    },
                    orderBy: { points: 'desc' }
                }
            },
            orderBy: [
                { totalScore: 'desc' },
                { name: 'asc' }
            ]
        })

        // Add ranks and format breakdown
        const response = leaderboard.map((team, index) => {
            // Group results by sport
            const breakdown = team.eventResults.map(r => ({
                eventName: r.event.name,
                sportName: r.event.sportType.name,
                rank: r.rank,
                points: r.points
            })).sort((a, b) => b.points - a.points)

            return {
                id: team.id,
                name: team.name,
                hexCode: team.hexCode,
                totalScore: team.totalScore,
                rank: index + 1,
                goldMedals: team._count.eventResults,
                _count: team._count,
                breakdown
            }
        })

        return NextResponse.json(response)
    } catch (error: any) {
        console.error('[LEADERBOARD_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
