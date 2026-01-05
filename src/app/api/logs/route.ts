import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/logs - List activity logs (Admin only)
export async function GET(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        const action = searchParams.get('action')
        const skip = (page - 1) * limit

        const where: any = {}
        if (action && action !== 'ALL') where.action = action

        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { username: true, role: true } },
                },
            }),
            prisma.activityLog.count({ where }),
        ])

        return NextResponse.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error('[LOGS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
