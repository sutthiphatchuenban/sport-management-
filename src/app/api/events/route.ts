import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'

// GET /api/events - List events (filter by status, sport, date)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const sportTypeId = searchParams.get('sportTypeId')
        const date = searchParams.get('date')
        const includeResults = searchParams.get('includeResults') === 'true'

        const where: any = {}
        if (status && status !== 'ALL') where.status = status
        if (sportTypeId && sportTypeId !== 'ALL') where.sportTypeId = sportTypeId
        if (date) {
            where.date = {
                gte: new Date(date),
                lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            }
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                sportType: { select: { name: true, category: true } },
                _count: { select: { registrations: true, results: true } },
                // Include results for showing match scores
                results: includeResults || status === 'COMPLETED' ? {
                    orderBy: { rank: 'asc' },
                    include: {
                        color: { select: { id: true, name: true, hexCode: true } },
                    },
                } : false,
            },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' },
            ],
        })

        return NextResponse.json(events)
    } catch (error: any) {
        console.error('[EVENTS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/events - Create event
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()

        // Handle Bulk Creation
        if (Array.isArray(body)) {
            const validatedEvents = body.map(item => {
                const validated = eventSchema.parse(item)
                return {
                    ...validated,
                    date: new Date(validated.date),
                    createdById: session.user.id,
                }
            })

            const events = await prisma.$transaction(
                validatedEvents.map(event => prisma.event.create({ data: event }))
            )

            return NextResponse.json(events, { status: 201 })
        }

        // Handle Single Creation
        const validatedData = eventSchema.parse(body)

        const event = await prisma.event.create({
            data: {
                ...validatedData,
                date: new Date(validatedData.date),
                createdById: session.user.id,
            },
            include: {
                sportType: { select: { name: true } },
            },
        })

        return NextResponse.json(event, { status: 201 })
    } catch (error: any) {
        console.error('[EVENTS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
