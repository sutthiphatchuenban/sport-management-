import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { announcementSchema } from '@/lib/validations'

// GET /api/announcements/[id]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const announcement = await prisma.announcement.findUnique({
            where: { id },
            include: {
                author: { select: { username: true } },
            },
        })

        if (!announcement) {
            return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
        }

        return NextResponse.json(announcement)
    } catch (error: any) {
        console.error('[ANNOUNCEMENT_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/announcements/[id]
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
        const validatedData = announcementSchema.parse(body)

        const announcement = await prisma.announcement.update({
            where: { id },
            data: validatedData,
            include: {
                author: { select: { username: true } },
            },
        })

        return NextResponse.json(announcement)
    } catch (error: any) {
        console.error('[ANNOUNCEMENT_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/announcements/[id]
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

        await prisma.announcement.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบประกาศสำเร็จ' })
    } catch (error: any) {
        console.error('[ANNOUNCEMENT_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
