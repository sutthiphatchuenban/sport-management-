import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { colorSchema } from '@/lib/validations'

// GET /api/colors - List all colors
export async function GET() {
    try {
        const colors = await prisma.color.findMany({
            include: {
                _count: { select: { majors: true, athletes: true, users: true } },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json(colors)
    } catch (error: any) {
        console.error('[COLORS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/colors - Create color (Admin only)
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = colorSchema.parse(body)

        // Check unique name
        const existingColor = await prisma.color.findUnique({
            where: { name: validatedData.name },
        })

        if (existingColor) {
            return NextResponse.json(
                { error: 'ชื่อสีนี้มีอยู่ในระบบแล้ว' },
                { status: 400 }
            )
        }

        const color = await prisma.color.create({
            data: validatedData,
        })

        return NextResponse.json(color, { status: 201 })
    } catch (error: any) {
        console.error('[COLORS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
