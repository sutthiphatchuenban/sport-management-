import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sportTypeSchema } from '@/lib/validations'

// GET /api/sport-types - List all sport types
export async function GET() {
    try {
        const sportTypes = await prisma.sportType.findMany({
            include: {
                _count: { select: { events: true } },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json(sportTypes)
    } catch (error: any) {
        console.error('[SPORT_TYPES_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/sport-types - Create sport type (Admin only)
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = sportTypeSchema.parse(body)

        const sportType = await prisma.sportType.create({
            data: validatedData,
        })

        return NextResponse.json(sportType, { status: 201 })
    } catch (error: any) {
        console.error('[SPORT_TYPES_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
