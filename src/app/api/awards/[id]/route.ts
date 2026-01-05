import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { awardSchema } from '@/lib/validations'

// GET /api/awards/[id]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const award = await prisma.award.findUnique({
            where: { id },
            include: {
                winners: {
                    include: {
                        athlete: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                nickname: true,
                                photoUrl: true,
                                color: { select: { name: true, hexCode: true } },
                                major: { select: { name: true } },
                            }
                        }
                    },
                    orderBy: { rank: 'asc' }
                }
            }
        })

        if (!award) {
            return NextResponse.json({ error: 'Award not found' }, { status: 404 })
        }

        return NextResponse.json(award)
    } catch (error: any) {
        console.error('[AWARD_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/awards/[id]
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
        const validatedData = awardSchema.parse(body)

        const award = await prisma.award.update({
            where: { id },
            data: validatedData,
        })

        return NextResponse.json(award)
    } catch (error: any) {
        console.error('[AWARD_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/awards/[id]
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

        // Delete award (cascades to winners in schema)
        await prisma.award.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบรางวัลสำเร็จ' })
    } catch (error: any) {
        console.error('[AWARD_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
