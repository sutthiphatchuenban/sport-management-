import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email } = forgotPasswordSchema.parse(body)

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // For security reasons, don't reveal if the email exists or not
            return NextResponse.json({
                message: "หากอีเมลนี้อยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ",
                success: true
            })
        }

        // TODO: In a real app, generate a reset token, save it to DB, and send an email
        // For this project, we'll just simulate success
        console.log(`Password reset requested for: ${email}`)

        return NextResponse.json({
            message: "หากอีเมลนี้อยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "เกิดข้อผิดพลาดบางอย่าง" },
            { status: 400 }
        )
    }
}
