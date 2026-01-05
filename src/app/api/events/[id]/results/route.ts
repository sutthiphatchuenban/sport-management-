import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { eventResultSchema } from '@/lib/validations'

// GET /api/events/[id]/results - Get results for an event
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const results = await prisma.eventResult.findMany({
            where: { eventId: id },
            include: {
                color: { select: { name: true, hexCode: true } },
                athlete: { select: { firstName: true, lastName: true, nickname: true } },
            },
            orderBy: { rank: 'asc' },
        })

        return NextResponse.json(results)
    } catch (error: any) {
        console.error('[EVENT_RESULTS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/events/[id]/results - Record/Update results
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
        const validatedData = eventResultSchema.parse(body)

        // Using transaction to update results and color scores
        const finalResults = await prisma.$transaction(async (tx) => {
            // 1. Get previous results to subtract points from colors
            const oldResults = await tx.eventResult.findMany({
                where: { eventId: id },
            })

            // Subtract old points
            for (const oldRes of oldResults) {
                await tx.color.update({
                    where: { id: oldRes.colorId },
                    data: { totalScore: { decrement: oldRes.points } },
                })
            }

            // 2. Delete existing results for this event
            await tx.eventResult.deleteMany({
                where: { eventId: id },
            })

            // 3. Create new results and add points to colors
            const newResults = await Promise.all(
                validatedData.results.map(async (res) => {
                    const result = await tx.eventResult.create({
                        data: {
                            eventId: id,
                            colorId: res.colorId,
                            athleteId: res.athleteId || null,
                            rank: res.rank,
                            points: res.points,
                            notes: res.notes,
                            recordedBy: session.user.id,
                        },
                    })

                    // Add new points
                    await tx.color.update({
                        where: { id: res.colorId },
                        data: { totalScore: { increment: res.points } },
                    })

                    return result
                })
            )

            // 4. Update event status to COMPLETED if it wasn't
            await tx.event.update({
                where: { id },
                data: { status: 'COMPLETED' },
            })

            return newResults
        })

        return NextResponse.json(finalResults)
    } catch (error: any) {
        console.error('[EVENT_RESULTS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
