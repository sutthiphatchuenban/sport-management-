import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { updateUserSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

// GET /api/users/[id] - Get user by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                major: { select: { id: true, name: true } },
                color: { select: { id: true, name: true, hexCode: true } },
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { password, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword)
    } catch (error: any) {
        console.error('[USER_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/users/[id] - Update user
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
        const validatedData = updateUserSchema.parse(body)

        // Check unique constraints if username or email is being updated
        if (validatedData.username || validatedData.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        validatedData.username ? { username: validatedData.username } : {},
                        validatedData.email ? { email: validatedData.email } : {},
                    ].filter(q => Object.keys(q).length > 0),
                    NOT: { id },
                },
            })

            if (existingUser) {
                return NextResponse.json(
                    { error: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' },
                    { status: 400 }
                )
            }
        }

        const updateData: any = { ...validatedData }
        if (validatedData.password) {
            updateData.password = await bcrypt.hash(validatedData.password, 12)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        })

        const { password, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword)
    } catch (error: any) {
        console.error('[USER_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/users/[id] - Delete user
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

        // Prevent admin from deleting themselves
        if (id === session.user.id) {
            return NextResponse.json(
                { error: 'คุณไม่สามารถลบบัญชีของตัวเองได้' },
                { status: 400 }
            )
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'ลบผู้ใช้งานสำเร็จ' })
    } catch (error: any) {
        console.error('[USER_DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
