import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, email, password } = registerSchema.parse(body)

        // Check availability
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'VIEWER',
                isActive: true
            },
            select: {
                id: true,
                username: true,
                role: true
            }
        })

        return NextResponse.json(user, { status: 201 })

    } catch (error: any) {
        console.error('[REGISTER_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
