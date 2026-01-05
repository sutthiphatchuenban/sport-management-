import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for creating a match
const createMatchSchema = z.object({
    roundName: z.string().min(1, 'กรุณาระบุชื่อรอบ'),
    roundNumber: z.number().int().positive().default(1),
    matchNumber: z.number().int().positive().default(1),
    homeColorId: z.string().min(1, 'กรุณาเลือกทีมเจ้าบ้าน'),
    awayColorId: z.string().min(1, 'กรุณาเลือกทีมเยือน'),
    scheduledAt: z.string().min(1, 'กรุณาระบุวันเวลา'),
    bracketPosition: z.number().int().optional(),
    nextMatchId: z.string().optional(),
})

// GET /api/events/[id]/matches - Get all matches for an event
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const matches = await prisma.match.findMany({
            where: { eventId: id },
            include: {
                homeColor: { select: { id: true, name: true, hexCode: true } },
                awayColor: { select: { id: true, name: true, hexCode: true } },
                participants: {
                    include: {
                        athlete: {
                            select: { id: true, firstName: true, lastName: true, nickname: true, photoUrl: true }
                        },
                        color: { select: { id: true, name: true, hexCode: true } }
                    }
                },
                _count: { select: { votes: true } }
            },
            orderBy: [
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

// POST /api/events/[id]/matches - Create a new match
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const body = await req.json()

        // Handle bulk creation
        if (Array.isArray(body)) {
            const matches = await prisma.$transaction(
                body.map((matchData: any) => {
                    const validated = createMatchSchema.parse(matchData)
                    return prisma.match.create({
                        data: {
                            eventId: id,
                            roundName: validated.roundName,
                            roundNumber: validated.roundNumber,
                            matchNumber: validated.matchNumber,
                            homeColorId: validated.homeColorId,
                            awayColorId: validated.awayColorId,
                            scheduledAt: new Date(validated.scheduledAt),
                            bracketPosition: validated.bracketPosition,
                            nextMatchId: validated.nextMatchId,
                        },
                        include: {
                            homeColor: { select: { id: true, name: true, hexCode: true } },
                            awayColor: { select: { id: true, name: true, hexCode: true } },
                        }
                    })
                })
            )
            return NextResponse.json(matches, { status: 201 })
        }

        // Single creation
        const validated = createMatchSchema.parse(body)

        const match = await prisma.match.create({
            data: {
                eventId: id,
                roundName: validated.roundName,
                roundNumber: validated.roundNumber,
                matchNumber: validated.matchNumber,
                homeColorId: validated.homeColorId,
                awayColorId: validated.awayColorId,
                scheduledAt: new Date(validated.scheduledAt),
                bracketPosition: validated.bracketPosition,
                nextMatchId: validated.nextMatchId,
            },
            include: {
                homeColor: { select: { id: true, name: true, hexCode: true } },
                awayColor: { select: { id: true, name: true, hexCode: true } },
            }
        })

        return NextResponse.json(match, { status: 201 })
    } catch (error: any) {
        console.error('[MATCHES_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
