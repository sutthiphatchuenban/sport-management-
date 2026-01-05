import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { registrationSchema } from '@/lib/validations'

// GET /api/events/[id]/registrations - Get registrations for an event
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const registrations = await prisma.eventRegistration.findMany({
            where: { eventId: id },
            include: {
                athlete: {
                    include: {
                        major: { select: { name: true } },
                        color: { select: { name: true, hexCode: true } },
                    },
                },
                color: { select: { name: true, hexCode: true } },
            },
            orderBy: { registeredAt: 'desc' },
        })

        return NextResponse.json(registrations)
    } catch (error: any) {
        console.error('[EVENT_REGISTRATIONS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/events/[id]/registrations - Register athletes
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only Admin, Organizer, or Team Manager can register
        if (!['ADMIN', 'ORGANIZER', 'TEAM_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const id = (await params).id
        const body = await req.json()
        const { athleteIds } = registrationSchema.parse(body)

        // 1. Check if event exists and is not cancelled/completed
        const event = await prisma.event.findUnique({
            where: { id },
            include: { sportType: true },
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        if (event.status === 'CANCELLED' || event.status === 'COMPLETED') {
            return NextResponse.json(
                { error: 'ไม่สามารถลงทะเบียนได้เนื่องจากการแข่งขันสิ้นสุดหรือถูกยกเลิกแล้ว' },
                { status: 400 }
            )
        }

        // 2. Perform registration in transaction
        const result = await prisma.$transaction(async (tx) => {
            const registrations = []

            for (const athleteId of athleteIds) {
                // Get athlete color
                const athlete = await tx.athlete.findUnique({
                    where: { id: athleteId },
                    select: { colorId: true },
                })

                if (!athlete) {
                    throw new Error(`ไม่พบนักกีฬา ID: ${athleteId}`)
                }

                // Security Check for Team Manager
                if (session.user.role === 'TEAM_MANAGER' && athlete.colorId !== session.user.colorId) {
                    throw new Error(`ไม่อนุญาตให้ลงทะเบียนนักกีฬาข้ามสีทีม`)
                }

                // Check if already registered
                const existing = await tx.eventRegistration.findUnique({
                    where: {
                        eventId_athleteId: {
                            eventId: id,
                            athleteId: athleteId,
                        },
                    },
                })

                if (!existing) {
                    const reg = await tx.eventRegistration.create({
                        data: {
                            eventId: id,
                            athleteId: athleteId,
                            colorId: athlete.colorId,
                        },
                    })
                    registrations.push(reg)
                }
            }

            return registrations
        })

        return NextResponse.json({
            message: `ลงทะเบียนนักกีฬาสำเร็จ ${result.length} คน`,
            registrations: result,
        })
    } catch (error: any) {
        console.error('[EVENT_REGISTRATIONS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
