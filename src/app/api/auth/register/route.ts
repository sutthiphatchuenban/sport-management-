import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, email, password } = registerSchema.parse(body)

        // Check if user exists
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
                { message: "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'VIEWER',
                isActive: true
            }
        })

        return NextResponse.json(
            { message: "ลงทะเบียนสำเร็จ", userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "ข้อมูลไม่ถูกต้อง", errors: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
            { status: 500 }
        )
    }
}
