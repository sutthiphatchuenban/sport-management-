import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { colorSchema } from '@/lib/validations'

// GET /api/colors/[id]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const color = await prisma.color.findUnique({
            where: { id },
        })

        if (!color) {
            return NextResponse.json({ error: 'Color not found' }, { status: 404 })
        }

        return NextResponse.json(color)
    } catch (error: any) {
        console.error('[COLOR_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/colors/[id]
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
        const validatedData = colorSchema.parse(body)

        // Check if name is taken by another record
        const existingColor = await prisma.color.findFirst({
            where: {
                name: validatedData.name,
                NOT: { id },
            },
        })

        if (existingColor) {
            return NextResponse.json(
                { error: 'ชื่อสีนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            )
        }

        const color = await prisma.color.update({
            where: { id },
            data: validatedData,
        })

        return NextResponse.json(color)
    } catch (error: any) {
        console.error('[COLOR_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/colors/[id]
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

        // Check if color has associations
        const color = await prisma.color.findUnique({
            where: { id },
            include: {
                _count: { select: { majors: true, athletes: true, users: true } },
            },
        })

        if (!color) {
            return NextResponse.json({ error: 'Color not found' }, { status: 404 })
        }

        if (color._count.majors > 0 || color._count.athletes > 0 || color._count.users > 0) {
            return NextResponse.json(
                { error: 'ไม่สามารถลบได้เนื่องจากมีข้อมูลสาขา ผู้ใช้งาน หรือนักกีฬาในระบบ' },
                { status: 400 }
            )
        }

        await prisma.color.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบสีสำเร็จ' })
    } catch (error: any) {
        console.error('[COLOR_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
