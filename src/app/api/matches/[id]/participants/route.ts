import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for adding participants
const addParticipantsSchema = z.object({
    participants: z.array(z.object({
        athleteId: z.string().min(1),
        colorId: z.string().min(1),
        position: z.string().optional(),
    }))
})

// GET /api/matches/[id]/participants - Get participants of a match
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const participants = await prisma.matchParticipant.findMany({
            where: { matchId: id },
            include: {
                athlete: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nickname: true,
                        photoUrl: true,
                        studentId: true
                    }
                },
                color: { select: { id: true, name: true, hexCode: true } }
            },
            orderBy: [
                { colorId: 'asc' },
                { position: 'asc' }
            ]
        })

        // Group by color
        const grouped = participants.reduce((acc: any, p) => {
            if (!acc[p.colorId]) {
                acc[p.colorId] = {
                    color: p.color,
                    athletes: []
                }
            }
            acc[p.colorId].athletes.push({
                ...p.athlete,
                position: p.position
            })
            return acc
        }, {})

        return NextResponse.json({
            participants,
            grouped: Object.values(grouped)
        })
    } catch (error: any) {
        console.error('[MATCH_PARTICIPANTS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/matches/[id]/participants - Add participants to a match
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER' && session?.user?.role !== 'TEAM_MANAGER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const body = await req.json()
        const validated = addParticipantsSchema.parse(body)

        // Create participants
        const created = await prisma.$transaction(
            validated.participants.map(p =>
                prisma.matchParticipant.upsert({
                    where: {
                        matchId_athleteId: {
                            matchId: id,
                            athleteId: p.athleteId
                        }
                    },
                    update: {
                        position: p.position
                    },
                    create: {
                        matchId: id,
                        athleteId: p.athleteId,
                        colorId: p.colorId,
                        position: p.position
                    }
                })
            )
        )

        return NextResponse.json(created, { status: 201 })
    } catch (error: any) {
        console.error('[MATCH_PARTICIPANTS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/matches/[id]/participants - Remove all participants
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const { searchParams } = new URL(req.url)
        const athleteId = searchParams.get('athleteId')

        if (athleteId) {
            // Delete specific participant
            await prisma.matchParticipant.delete({
                where: {
                    matchId_athleteId: {
                        matchId: id,
                        athleteId
                    }
                }
            })
        } else {
            // Delete all participants
            await prisma.matchParticipant.deleteMany({
                where: { matchId: id }
            })
        }

        return NextResponse.json({ message: 'Participants removed' })
    } catch (error: any) {
        console.error('[MATCH_PARTICIPANTS_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
