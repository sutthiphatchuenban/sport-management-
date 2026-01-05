import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { athleteSchema } from '@/lib/validations'

// GET /api/athletes/[id] - Get athlete details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const athlete = await prisma.athlete.findUnique({
            where: { id },
            include: {
                major: true,
                color: true,
                _count: {
                    select: {
                        registrations: true,
                        votes: true,
                        awardWinners: true,
                    },
                },
            },
        })

        if (!athlete) {
            return NextResponse.json({ error: 'Athlete not found' }, { status: 404 })
        }

        return NextResponse.json(athlete)
    } catch (error: any) {
        console.error('[ATHLETE_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/athletes/[id] - Update athlete
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session || !['ADMIN', 'ORGANIZER', 'TEAM_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const body = await req.json()
        const validatedData = athleteSchema.parse(body)

        // Security Check for Team Manager
        if (session.user.role === 'TEAM_MANAGER') {
            const currentAthlete = await prisma.athlete.findUnique({
                where: { id },
                select: { colorId: true }
            })
            if (!currentAthlete || currentAthlete.colorId !== session.user.colorId) {
                return NextResponse.json({ error: 'คุณไม่ได้รับอนุญาตให้แก้ไขนักกีฬาในสีอื่น' }, { status: 403 })
            }
            // Also ensure they are not changing the color to someone else's
            if (validatedData.colorId !== session.user.colorId) {
                return NextResponse.json({ error: 'คุณไม่ได้รับอนุญาตให้ย้ายนักกีฬาไปสีอื่น' }, { status: 403 })
            }
        }

        // Check unique constraints
        const existing = await prisma.athlete.findFirst({
            where: {
                studentId: validatedData.studentId,
                NOT: { id },
            },
        })

        if (existing) {
            return NextResponse.json(
                { error: 'รหัสนิสิตนี้ถูกใช้งานโดยบุคคลอื่นในระบบแล้ว' },
                { status: 400 }
            )
        }

        const athlete = await prisma.athlete.update({
            where: { id },
            data: validatedData,
            include: {
                major: { select: { name: true } },
                color: { select: { name: true, hexCode: true } },
            },
        })

        return NextResponse.json(athlete)
    } catch (error: any) {
        console.error('[ATHLETE_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/athletes/[id] - Delete athlete
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session || !['ADMIN', 'ORGANIZER', 'TEAM_MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id

        // Check ownership and constraints
        const athlete = await prisma.athlete.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        registrations: true,
                        votes: true,
                    },
                },
            },
        })

        if (!athlete) {
            return NextResponse.json({ error: 'Athlete not found' }, { status: 404 })
        }

        // Security Check for Team Manager
        if (session.user.role === 'TEAM_MANAGER' && athlete.colorId !== session.user.colorId) {
            return NextResponse.json({ error: 'คุณไม่ได้รับอนุญาตให้ลบนักกีฬาในสีอื่น' }, { status: 403 })
        }

        if (athlete._count.registrations > 0 || athlete._count.votes > 0) {
            return NextResponse.json(
                { error: 'ไม่สามารถลบได้เนื่องจากนักกีฬามีการลงทะเบียนเข้าแข่งขันหรือมีคะแนนโหวต' },
                { status: 400 }
            )
        }

        await prisma.athlete.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบข้อมูลนักกีฬาสำเร็จ' })
    } catch (error: any) {
        console.error('[ATHLETE_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
