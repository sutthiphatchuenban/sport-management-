import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// PATCH /api/users/[id]/toggle-status - Toggle active status
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const id = (await params).id

        // Prevent admin from deactivating themselves
        if (id === session.user.id) {
            return NextResponse.json(
                { error: 'คุณไม่สามารถเปลี่ยนสถานะบัญชีของตัวเองได้' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { isActive: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
        })

        return NextResponse.json({
            message: `สถานะผู้ใช้งานถูกเปลี่ยนเป็น ${updatedUser.isActive ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'}`,
            isActive: updatedUser.isActive,
        })
    } catch (error: any) {
        console.error('[USER_TOGGLE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
