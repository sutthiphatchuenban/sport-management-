import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/votes/[eventId]/stats - Get vote statistics
export async function GET(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const eventId = (await params).eventId
        const session = await auth()

        // 1. Check settings
        let settings = await prisma.voteSetting.findUnique({
            where: { eventId },
        })

        if (!settings) {
            settings = await prisma.voteSetting.findFirst({
                where: { eventId: null },
            })
        }

        // 2. Access control for results
        const isAdminOrOrganizer = session?.user && ['ADMIN', 'ORGANIZER'].includes(session.user.role)
        if (!isAdminOrOrganizer && settings && !settings.showRealtimeResults) {
            return NextResponse.json({
                error: 'ยังไม่เปิดให้ดูผลโหวตในขณะนี้',
                hidden: true
            }, { status: 403 })
        }

        // 3. Get summaries
        const summaries = await prisma.athleteVoteSummary.findMany({
            where: { eventId },
            include: {
                athlete: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nickname: true,
                        photoUrl: true,
                        major: { select: { name: true } },
                        color: { select: { name: true, hexCode: true } },
                    }
                }
            },
            orderBy: { totalVotes: 'desc' },
        })

        // Adding ranks on the fly
        const response = summaries.map((s, index) => ({
            ...s,
            calculatedRank: index + 1
        }))

        return NextResponse.json(response)

    } catch (error: any) {
        console.error('[VOTE_STATS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
