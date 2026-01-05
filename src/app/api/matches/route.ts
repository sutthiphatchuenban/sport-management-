import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/matches - Get all matches (with filters)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const eventId = searchParams.get('eventId')
        const sportTypeId = searchParams.get('sportTypeId')

        const where: any = {}
        if (status && status !== 'ALL') where.status = status
        if (eventId) where.eventId = eventId
        if (sportTypeId) {
            where.event = { sportTypeId }
        }

        const matches = await prisma.match.findMany({
            where,
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                        sportType: { select: { name: true, category: true } }
                    }
                },
                homeColor: { select: { id: true, name: true, hexCode: true } },
                awayColor: { select: { id: true, name: true, hexCode: true } },
            },
            orderBy: [
                { scheduledAt: 'desc' },
                { roundNumber: 'asc' },
                { matchNumber: 'asc' }
            ]
        })

        return NextResponse.json(matches)
    } catch (error: any) {
        console.error('[MATCHES_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

