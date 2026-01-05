import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sportTypeSchema } from '@/lib/validations'

// GET /api/sport-types/[id]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const sportType = await prisma.sportType.findUnique({
            where: { id },
        })

        if (!sportType) {
            return NextResponse.json({ error: 'Sport type not found' }, { status: 404 })
        }

        return NextResponse.json(sportType)
    } catch (error: any) {
        console.error('[SPORT_TYPE_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/sport-types/[id]
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const body = await req.json()
        const validatedData = sportTypeSchema.parse(body)

        const sportType = await prisma.sportType.update({
            where: { id },
            data: validatedData,
        })

        return NextResponse.json(sportType)
    } catch (error: any) {
        console.error('[SPORT_TYPE_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/sport-types/[id]
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id

        // Check if sport type has events
        const sportType = await prisma.sportType.findUnique({
            where: { id },
            include: {
                _count: { select: { events: true } },
            },
        })

        if (!sportType) {
            return NextResponse.json({ error: 'Sport type not found' }, { status: 404 })
        }

        if (sportType._count.events > 0) {
            return NextResponse.json(
                { error: 'ไม่สามารถลบได้เนื่องจากมีข้อมูลรายการแข่งขันที่อ้างถึงประเภทกีฬานี้' },
                { status: 400 }
            )
        }

        await prisma.sportType.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบประเภทกีฬาสำเร็จ' })
    } catch (error: any) {
        console.error('[SPORT_TYPE_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
