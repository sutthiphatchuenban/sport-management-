import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { voteSettingsSchema } from '@/lib/validations'

// GET /api/votes/[eventId]/settings - Get vote settings
export async function GET(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const eventId = (await params).eventId

        // Try to find event-specific settings, fallback to global settings (eventId: null)
        let settings = await prisma.voteSetting.findUnique({
            where: { eventId },
        })

        if (!settings) {
            settings = await prisma.voteSetting.findFirst({
                where: { eventId: null },
            })
        }

        return NextResponse.json(settings)
    } catch (error: any) {
        console.error('[VOTE_SETTINGS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PUT /api/votes/[eventId]/settings - Update settings
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const eventId = (await params).eventId
        const body = await req.json()
        const validatedData = voteSettingsSchema.parse(body)

        const settings = await prisma.voteSetting.upsert({
            where: { eventId },
            update: {
                ...validatedData,
                votingStart: validatedData.votingStart ? new Date(validatedData.votingStart) : null,
                votingEnd: validatedData.votingEnd ? new Date(validatedData.votingEnd) : null,
            },
            create: {
                ...validatedData,
                eventId,
                votingStart: validatedData.votingStart ? new Date(validatedData.votingStart) : null,
                votingEnd: validatedData.votingEnd ? new Date(validatedData.votingEnd) : null,
            },
        })

        return NextResponse.json(settings)
    } catch (error: any) {
        console.error('[VOTE_SETTINGS_PUT]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/votes/[eventId]/toggle - Toggle voting
export async function POST(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const eventId = (await params).eventId
        const { enabled } = await req.json()

        const settings = await prisma.voteSetting.upsert({
            where: { eventId },
            update: { votingEnabled: enabled },
            create: {
                eventId,
                votingEnabled: enabled,
                maxVotesPerUser: 1, // default
                showRealtimeResults: true, // default
            },
        })

        return NextResponse.json(settings)
    } catch (error: any) {
        console.error('[VOTE_TOGGLE_POST]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
