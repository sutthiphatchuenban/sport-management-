import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { awardWinnerSchema } from '@/lib/validations'

// GET /api/awards/winners - List all award winners
export async function GET() {
    try {
        const winners = await prisma.awardWinner.findMany({
            include: {
                award: true,
                athlete: {
                    select: {
                        firstName: true,
                        lastName: true,
                        nickname: true,
                        photoUrl: true,
                        color: { select: { name: true, hexCode: true } },
                        major: { select: { name: true } },
                    }
                }
            },
            orderBy: [
                { award: { name: 'asc' } },
                { rank: 'asc' }
            ]
        })

        return NextResponse.json(winners)
    } catch (error: any) {
        console.error('[AWARD_WINNERS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/awards/winners - Record/Update winners
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await req.json()
        const { winners } = awardWinnerSchema.parse(body)

        // Using transaction to set winners
        const result = await prisma.$transaction(async (tx) => {
            const recordedWinners = []

            for (const win of winners) {
                // Delete existing if same award/athlete/rank (or just clear award first)
                // Actually, let's just clear the award's winners first if it's the first time

                const rec = await tx.awardWinner.create({
                    data: {
                        awardId: win.awardId,
                        athleteId: win.athleteId,
                        rank: win.rank,
                        announcedAt: new Date(),
                    },
                })
                recordedWinners.push(rec)
            }

            return recordedWinners
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('[AWARD_WINNERS_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
