import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for updating match result
const updateMatchSchema = z.object({
    homeScore: z.number().int().min(0).optional(),
    awayScore: z.number().int().min(0).optional(),
    status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
    notes: z.string().optional(),
})

// GET /api/matches/[id] - Get match details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const match = await prisma.match.findUnique({
            where: { id },
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
                participants: {
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
                    }
                },
                votes: {
                    include: {
                        athlete: {
                            select: { id: true, firstName: true, lastName: true }
                        }
                    }
                },
                _count: { select: { votes: true, participants: true } }
            }
        })

        if (!match) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        // Calculate vote counts per athlete
        const votesByAthlete = match.votes.reduce((acc: any, vote) => {
            const athleteId = vote.athleteId
            if (!acc[athleteId]) {
                acc[athleteId] = {
                    athleteId,
                    athleteName: `${vote.athlete.firstName} ${vote.athlete.lastName}`,
                    count: 0
                }
            }
            acc[athleteId].count++
            return acc
        }, {})

        const voteStats = Object.values(votesByAthlete).sort((a: any, b: any) => b.count - a.count)

        return NextResponse.json({
            ...match,
            voteStats
        })
    } catch (error: any) {
        console.error('[MATCH_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/matches/[id] - Update match (score, status)
export async function PUT(
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
        const validated = updateMatchSchema.parse(body)

        // Get current match
        const currentMatch = await prisma.match.findUnique({
            where: { id },
            include: { event: true }
        })

        if (!currentMatch) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        // Update match
        const updateData: any = {
            ...validated,
            recordedBy: session.user.id,
        }

        // If completing the match
        if (validated.status === 'COMPLETED') {
            updateData.endedAt = new Date()
        }

        // If starting the match
        if (validated.status === 'ONGOING' && !currentMatch.startedAt) {
            updateData.startedAt = new Date()
        }

        const match = await prisma.match.update({
            where: { id },
            data: updateData,
            include: {
                homeColor: { select: { id: true, name: true, hexCode: true } },
                awayColor: { select: { id: true, name: true, hexCode: true } },
            }
        })

        // If match is completed, update event results
        if (validated.status === 'COMPLETED' && validated.homeScore !== undefined && validated.awayScore !== undefined) {
            // Determine winner
            const winnerId = validated.homeScore > validated.awayScore
                ? match.homeColorId
                : validated.awayScore > validated.homeScore
                    ? match.awayColorId
                    : null // Draw

            // Check if all matches in this event are completed
            const allMatches = await prisma.match.findMany({
                where: { eventId: currentMatch.eventId }
            })
            const allCompleted = allMatches.every(m => m.id === id ? true : m.status === 'COMPLETED')

            if (allCompleted) {
                // Update event status
                await prisma.event.update({
                    where: { id: currentMatch.eventId },
                    data: { status: 'COMPLETED' }
                })
            }
        }

        return NextResponse.json(match)
    } catch (error: any) {
        console.error('[MATCH_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/matches/[id] - Delete match
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

        await prisma.match.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Match deleted' })
    } catch (error: any) {
        console.error('[MATCH_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
