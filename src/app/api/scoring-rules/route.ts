import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { scoringRulesSchema } from '@/lib/validations'

// GET /api/scoring-rules - Get scoring rules (Global or Event-specific)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const eventId = searchParams.get('eventId')

        const rules = await prisma.scoringRule.findMany({
            where: {
                eventId: eventId || null,
            },
            orderBy: { rank: 'asc' },
        })

        return NextResponse.json(rules)
    } catch (error: any) {
        console.error('[SCORING_RULES_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/scoring-rules - Update scoring rules
export async function PUT(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const eventId = searchParams.get('eventId')

        const body = await req.json()
        const validatedData = scoringRulesSchema.parse(body)

        // Using transaction to delete old rules and create new ones
        const result = await prisma.$transaction(async (tx) => {
            // Delete existing rules for this scope
            await tx.scoringRule.deleteMany({
                where: {
                    eventId: eventId || null,
                },
            })

            // Create new rules
            const newRules = await Promise.all(
                validatedData.rules.map((rule) =>
                    tx.scoringRule.create({
                        data: {
                            rank: rule.rank,
                            points: rule.points,
                            eventId: eventId || null,
                        },
                    })
                )
            )

            return newRules
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('[SCORING_RULES_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
