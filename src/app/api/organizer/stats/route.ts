import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const [
            myEventCount,
            todayEvents,
            upcomingCount,
            totalVotes,
            recentResults,
            latestAwards
        ] = await Promise.all([
            // Total events for this organizer (if restricted, but here we show all for simplicity)
            prisma.event.count(),
            // Events scheduled for today
            prisma.event.findMany({
                where: {
                    date: {
                        gte: today,
                        lt: tomorrow
                    }
                },
                include: {
                    sportType: { select: { name: true } },
                    _count: { select: { registrations: true } }
                }
            }),
            // Upcoming events
            prisma.event.count({
                where: { status: 'UPCOMING' }
            }),
            // Total votes cast so far
            prisma.vote.count(),
            // Recent competition results
            prisma.eventResult.findMany({
                take: 5,
                orderBy: { recordedAt: 'desc' },
                include: {
                    event: { select: { name: true } },
                    color: { select: { name: true, hexCode: true } },
                    athlete: { select: { firstName: true, lastName: true } }
                }
            }),
            // Latest award winners
            prisma.awardWinner.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: {
                    award: { select: { name: true } },
                    athlete: { select: { firstName: true, lastName: true, color: { select: { name: true, hexCode: true } } } }
                }
            })
        ])

        return NextResponse.json({
            stats: {
                totalEvents: myEventCount,
                upcomingEvents: upcomingCount,
                totalVotes: totalVotes,
                todayCount: todayEvents.length
            },
            todayEvents,
            recentResults,
            latestAwards
        })
    } catch (error) {
        console.error('[ORGANIZER_STATS]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
