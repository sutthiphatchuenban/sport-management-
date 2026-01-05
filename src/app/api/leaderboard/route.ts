import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/leaderboard - Get current team standings
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
                }
            },
            orderBy: [
                { totalScore: 'desc' },
                { name: 'asc' }
            ]
        })

        // Add ranks on the fly
        const response = leaderboard.map((team, index) => ({
            ...team,
            rank: index + 1,
            goldMedals: team._count.eventResults,
        }))

        return NextResponse.json(response)
    } catch (error: any) {
        console.error('[LEADERBOARD_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
