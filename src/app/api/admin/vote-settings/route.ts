import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let settings = await prisma.voteSetting.findUnique({
            where: { eventId: null as any } // In Prisma, if it's unique but optional, you might need a different way or findFirst
        })

        // Use findFirst for null eventId if findUnique doesn't support it directly with @unique on optional field in some prisma versions
        if (!settings) {
            settings = await prisma.voteSetting.findFirst({
                where: { eventId: null }
            })
        }

        if (!settings) {
            // Create default global settings if none exist
            settings = await prisma.voteSetting.create({
                data: {
                    votingEnabled: true,
                    maxVotesPerUser: 1,
                    showRealtimeResults: true
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { votingEnabled, maxVotesPerUser, showRealtimeResults, votingStart, votingEnd } = body

        const globalSettings = await prisma.voteSetting.findFirst({
            where: { eventId: null }
        })

        let settings;
        if (globalSettings) {
            settings = await prisma.voteSetting.update({
                where: { id: globalSettings.id },
                data: {
                    votingEnabled,
                    maxVotesPerUser,
                    showRealtimeResults,
                    votingStart: votingStart ? new Date(votingStart) : null,
                    votingEnd: votingEnd ? new Date(votingEnd) : null,
                }
            })
        } else {
            settings = await prisma.voteSetting.create({
                data: {
                    eventId: null,
                    votingEnabled,
                    maxVotesPerUser,
                    showRealtimeResults,
                    votingStart: votingStart ? new Date(votingStart) : null,
                    votingEnd: votingEnd ? new Date(votingEnd) : null,
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
