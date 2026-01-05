import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { awardSchema } from '@/lib/validations'

// GET /api/awards - List all awards
export async function GET() {
    try {
        const awards = await prisma.award.findMany({
            include: {
                _count: { select: { winners: true } },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json(awards)
    } catch (error: any) {
        console.error('[AWARDS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/awards - Create award
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = awardSchema.parse(body)

        const award = await prisma.award.create({
            data: validatedData,
        })

        return NextResponse.json(award, { status: 201 })
    } catch (error: any) {
        console.error('[AWARDS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
