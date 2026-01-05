import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'

// GET /api/events/[id] - Get event details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                sportType: true,
                createdBy: { select: { username: true } },
                _count: { select: { registrations: true, results: true } },
                voteSettings: true,
            },
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error: any) {
        console.error('[EVENT_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/events/[id] - Update event
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
        const validatedData = eventSchema.parse(body)

        const event = await prisma.event.update({
            where: { id },
            data: {
                ...validatedData,
                date: new Date(validatedData.date),
            },
            include: {
                sportType: { select: { name: true } },
            },
        })

        return NextResponse.json(event)
    } catch (error: any) {
        console.error('[EVENT_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/events/[id] - Delete event
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

        // Checking if we can delete (e.g., no results yet?)
        // In some systems, we might prevent deletion if there are results

        await prisma.event.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบรายการแข่งขันสำเร็จ' })
    } catch (error: any) {
        console.error('[EVENT_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PATCH /api/events/[id]/status - Update status
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const { status } = await req.json()

        if (!['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const event = await prisma.event.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(event)
    } catch (error: any) {
        console.error('[EVENT_STATUS_PATCH]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
