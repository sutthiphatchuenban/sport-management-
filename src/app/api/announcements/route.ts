import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { announcementSchema } from '@/lib/validations'

// GET /api/announcements - List announcements
export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            include: {
                author: { select: { username: true } },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(announcements)
    } catch (error: any) {
        console.error('[ANNOUNCEMENTS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/announcements - Create announcement
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = announcementSchema.parse(body)

        const announcement = await prisma.announcement.create({
            data: {
                ...validatedData,
                createdBy: session.user.id,
            },
            include: {
                author: { select: { username: true } },
            },
        })

        return NextResponse.json(announcement, { status: 201 })
    } catch (error: any) {
        console.error('[ANNOUNCEMENTS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
