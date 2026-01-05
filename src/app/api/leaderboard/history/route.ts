import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/leaderboard/history - Get score progression over time
export async function GET() {
    try {
        // Fetch all event results ordered by time
        const results = await prisma.eventResult.findMany({
            include: {
                color: { select: { name: true, hexCode: true } },
            },
            orderBy: { recordedAt: 'asc' },
        })

        // Group results by date (or just return them as a sequence for charting)
        // For a line chart, we usually want: [{ date: '...', color1: score, color2: score, ... }]

        const colors = await prisma.color.findMany({
            select: { id: true, name: true, hexCode: true }
        })

        const history: any[] = []
        const currentScores: Record<string, number> = {}

        // Initialize scores
        colors.forEach(c => currentScores[c.id] = 0)

        // Process results into a cumulative history
        results.forEach(res => {
            currentScores[res.colorId] += res.points

            // Push a snapshot
            const snapshot: any = {
                timestamp: res.recordedAt,
                eventName: res.eventId, // Could join to get name if needed
            }

            colors.forEach(c => {
                snapshot[c.name] = currentScores[c.id]
            })

            history.push(snapshot)
        })

        return NextResponse.json({
            colors: colors.map(c => ({ name: c.name, hexCode: c.hexCode })),
            history
        })
    } catch (error: any) {
        console.error('[LEADERBOARD_HISTORY_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
