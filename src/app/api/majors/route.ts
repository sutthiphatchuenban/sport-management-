import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { majorSchema } from '@/lib/validations'

// GET /api/majors - List all majors
export async function GET() {
    try {
        const majors = await prisma.major.findMany({
            include: {
                color: { select: { name: true, hexCode: true } },
                _count: { select: { athletes: true, users: true } },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json(majors)
    } catch (error: any) {
        console.error('[MAJORS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/majors - Create major (Admin only)
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = majorSchema.parse(body)

        // Check unique code
        const existingMajor = await prisma.major.findUnique({
            where: { code: validatedData.code },
        })

        if (existingMajor) {
            return NextResponse.json(
                { error: 'รหัสสาขานี้มีอยู่ในระบบแล้ว' },
                { status: 400 }
            )
        }

        const major = await prisma.major.create({
            data: validatedData,
            include: {
                color: { select: { name: true, hexCode: true } },
            },
        })

        return NextResponse.json(major, { status: 201 })
    } catch (error: any) {
        console.error('[MAJORS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
