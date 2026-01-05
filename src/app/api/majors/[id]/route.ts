import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { majorSchema } from '@/lib/validations'

// GET /api/majors/[id]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const major = await prisma.major.findUnique({
            where: { id },
            include: {
                color: { select: { id: true, name: true, hexCode: true } },
            },
        })

        if (!major) {
            return NextResponse.json({ error: 'Major not found' }, { status: 404 })
        }

        return NextResponse.json(major)
    } catch (error: any) {
        console.error('[MAJOR_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/majors/[id]
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
        const validatedData = majorSchema.parse(body)

        // Check if code is taken by another record
        const existingMajor = await prisma.major.findFirst({
            where: {
                code: validatedData.code,
                NOT: { id },
            },
        })

        if (existingMajor) {
            return NextResponse.json(
                { error: 'รหัสสาขานี้ถูกใช้งานแล้ว' },
                { status: 400 }
            )
        }

        const major = await prisma.major.update({
            where: { id },
            data: validatedData,
            include: {
                color: { select: { name: true, hexCode: true } },
            },
        })

        return NextResponse.json(major)
    } catch (error: any) {
        console.error('[MAJOR_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/majors/[id]
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

        // Check if major has users or athletes
        const major = await prisma.major.findUnique({
            where: { id },
            include: {
                _count: { select: { users: true, athletes: true } },
            },
        })

        if (!major) {
            return NextResponse.json({ error: 'Major not found' }, { status: 404 })
        }

        if (major._count.users > 0 || major._count.athletes > 0) {
            return NextResponse.json(
                { error: 'ไม่สามารถลบได้เนื่องจากมีข้อมูลผู้ใช้งานหรือนักกีฬาในระบบ' },
                { status: 400 }
            )
        }

        await prisma.major.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบสาขาสำเร็จ' })
    } catch (error: any) {
        console.error('[MAJOR_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
