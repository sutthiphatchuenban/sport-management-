import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { athleteSchema } from '@/lib/validations'

// GET /api/athletes - List athletes (filter, search)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const search = searchParams.get('search') || ''
        const majorId = searchParams.get('majorId')
        const colorId = searchParams.get('colorId')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit

        const where: any = {
            OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { nickname: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search, mode: 'insensitive' } },
            ],
        }

        if (majorId && majorId !== 'ALL') where.majorId = majorId
        if (colorId && colorId !== 'ALL') where.colorId = colorId

        const [athletes, total] = await Promise.all([
            prisma.athlete.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    major: { select: { name: true } },
                    color: { select: { name: true, hexCode: true } },
                    _count: { select: { votes: true } },
                    individualResult: {
                        where: { rank: { lte: 3 } },
                        select: { rank: true }
                    }
                },
            }),
            prisma.athlete.count({ where }),
        ])

        return NextResponse.json({
            athletes,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error('[ATHLETES_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/athletes - Create athlete
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !['ADMIN', 'ORGANIZER', 'TEAM_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = athleteSchema.parse(body)

        // Security: Team Manager can only add athletes to their own team
        if (session.user.role === 'TEAM_MANAGER' && session.user.colorId !== validatedData.colorId) {
            return NextResponse.json({ error: 'คุณไม่ได้รับอนุญาตให้เพิ่มนักกีฬาเข้าสีอื่น' }, { status: 403 })
        }

        // Check if student ID already exists
        const existing = await prisma.athlete.findUnique({
            where: { studentId: validatedData.studentId },
        })

        if (existing) {
            return NextResponse.json(
                { error: 'รหัสนิสิตนี้มีอยู่ในระบบแล้ว' },
                { status: 400 }
            )
        }

        const athlete = await prisma.athlete.create({
            data: {
                ...validatedData,
                registeredBy: session.user.id,
            },
            include: {
                major: { select: { name: true } },
                color: { select: { name: true, hexCode: true } },
            },
        })

        return NextResponse.json(athlete, { status: 201 })
    } catch (error: any) {
        console.error('[ATHLETES_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
