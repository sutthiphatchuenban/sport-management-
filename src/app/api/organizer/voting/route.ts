import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { voteSettingsSchema } from '@/lib/validations'

// GET /api/organizer/voting - List events with their vote statuses for organizers
export async function GET() {
    try {
        const session = await auth()
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const events = await prisma.event.findMany({
            include: {
                sportType: { select: { name: true } },
                voteSettings: true,
                _count: { select: { votes: true } }
            },
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(events)
    } catch (error) {
        console.error('[ORGANIZER_VOTING_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/organizer/voting - Update settings for a specific event
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { eventId, ...settingsBody } = body

        if (!eventId) {
            return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
        }

        const validatedData = voteSettingsSchema.parse(settingsBody)

        const existingSettings = await prisma.voteSetting.findFirst({
            where: { eventId }
        })

        const settingsData = {
            votingEnabled: validatedData.votingEnabled,
            maxVotesPerUser: validatedData.maxVotesPerUser,
            showRealtimeResults: validatedData.showRealtimeResults,
            votingStart: validatedData.votingStart ? new Date(validatedData.votingStart) : null,
            votingEnd: validatedData.votingEnd ? new Date(validatedData.votingEnd) : null,
            eventId
        }

        let result;
        if (existingSettings) {
            result = await prisma.voteSetting.update({
                where: { id: existingSettings.id },
                data: settingsData
            })
        } else {
            result = await prisma.voteSetting.create({
                data: settingsData
            })
        }

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('[ORGANIZER_VOTING_POST]', error)
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
