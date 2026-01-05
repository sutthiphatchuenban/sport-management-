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

        const [
            teamInfo,
            athleteCount,
            regCount,
            recentResults,
            pendingEvents
        ] = await Promise.all([
            // 1. Team Score and Info
            prisma.color.findUnique({
                where: { id: colorId },
                select: { name: true, hexCode: true, totalScore: true }
            }),
            // 2. Athlete Count
            prisma.athlete.count({
                where: { colorId }
            }),
            // 3. Total Team Registrations
            prisma.eventRegistration.count({
                where: { colorId }
            }),
            // 4. Recent results for this team
            prisma.eventResult.findMany({
                where: { colorId },
                include: {
                    event: { select: { name: true, sportType: { select: { name: true } } } },
                    athlete: { select: { firstName: true, nickname: true } }
                },
                orderBy: { recordedAt: 'desc' },
                take: 5
            }),
            // 5. Upcoming events where team has registrations
            prisma.event.findMany({
                where: {
                    status: 'UPCOMING',
                    registrations: { some: { colorId } }
                },
                include: {
                    sportType: { select: { name: true } },
                    _count: { select: { registrations: { where: { colorId } } } }
                },
                orderBy: { date: 'asc' },
                take: 5
            })
        ])

        return NextResponse.json({
            teamInfo,
            stats: {
                totalScore: teamInfo?.totalScore || 0,
                athleteCount,
                registrationCount: regCount,
                upcomingEvents: pendingEvents.length
            },
            recentResults,
            upcomingEvents: pendingEvents
        })
    } catch (error) {
        console.error('[TEAM_STATS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
