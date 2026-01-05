import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Color Standings (Points & Medal Counts)
        const colors = await prisma.color.findMany({
            include: {
                eventResults: {
                    select: { rank: true, points: true }
                },
                eventRegistrations: {
                    select: { athleteId: true }
                }
            }
        })

        const colorStandings = colors.map(color => {
            const results = color.eventResults || []
            return {
                id: color.id,
                name: color.name,
                hexCode: color.hexCode,
                totalPoints: results.reduce((acc: number, curr: any) => acc + curr.points, 0),
                gold: results.filter((r: any) => r.rank === 1).length,
                silver: results.filter((r: any) => r.rank === 2).length,
                bronze: results.filter((r: any) => r.rank === 3).length,
                athleteCount: color.eventRegistrations?.length || 0
            }
        }).sort((a, b) => b.totalPoints - a.totalPoints)

        // 2. Sport Type Stats
        const sportTypes = await prisma.sportType.findMany({
            include: {
                _count: { select: { events: true } }
            }
        })

        // 3. Top Athletes by Points
        // We'll need to aggregate eventResult by athleteId
        const athletePoints = await prisma.eventResult.groupBy({
            by: ['athleteId'],
            where: { athleteId: { not: null } },
            _sum: { points: true },
            orderBy: { _sum: { points: 'desc' } },
            take: 10
        })

        const topAthletes = await Promise.all(
            athletePoints.map(async (ap) => {
                const athlete = await prisma.athlete.findUnique({
                    where: { id: ap.athleteId! },
                    include: { color: { select: { name: true, hexCode: true } } }
                })
                return {
                    ...athlete,
                    totalPoints: ap._sum?.points || 0
                }
            })
        )

        // 4. Registration Overview
        const totalRegistrations = await prisma.eventRegistration.count()
        const uniqueAthletes = await prisma.athlete.count()

        return NextResponse.json({
            colorStandings,
            sportTypes,
            topAthletes,
            summary: {
                totalRegistrations,
                uniqueAthletes,
                totalEvents: await prisma.event.count()
            }
        })
    } catch (error) {
        console.error('[REPORTS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
