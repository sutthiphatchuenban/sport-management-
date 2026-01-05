import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createUserSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

// GET /api/users - List users (pagination, filter, search)
export async function GET(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role')
        const skip = (page - 1) * limit

        const where: any = {
            OR: [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        }

        if (role && role !== 'ALL') {
            where.role = role
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    major: { select: { name: true } },
                    color: { select: { name: true, hexCode: true } },
                },
            }),
            prisma.user.count({ where }),
        ])

        return NextResponse.json({
            users: users.map(user => {
                const { password, ...u } = user
                return u
            }),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error('[USERS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/users - Create user (Admin only)
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = createUserSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    { email: validatedData.email },
                ],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 12)

        const user = await prisma.user.create({
            data: {
                ...validatedData,
                password: hashedPassword,
            },
        })

        const { password, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword, { status: 201 })
    } catch (error: any) {
        console.error('[USERS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
