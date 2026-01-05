import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/events/[id]/bracket - Get tournament bracket for event
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        // Get event with matches
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                sportType: { select: { name: true, category: true } },
                matches: {
                    include: {
                        homeColor: { select: { id: true, name: true, hexCode: true } },
                        awayColor: { select: { id: true, name: true, hexCode: true } },
                    },
                    orderBy: [
                        { roundNumber: 'asc' },
                        { matchNumber: 'asc' }
                    ]
                }
            }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        // Group matches by round
        const rounds = event.matches.reduce((acc: any, match) => {
            if (!acc[match.roundNumber]) {
                acc[match.roundNumber] = {
                    roundNumber: match.roundNumber,
                    roundName: match.roundName,
                    matches: []
                }
            }

            // Determine winner
            let winner = null
            if (match.status === 'COMPLETED' && match.homeScore !== null && match.awayScore !== null) {
                if (match.homeScore > match.awayScore) {
                    winner = match.homeColor
                } else if (match.awayScore > match.homeScore) {
                    winner = match.awayColor
                }
            }

            acc[match.roundNumber].matches.push({
                id: match.id,
                matchNumber: match.matchNumber,
                bracketPosition: match.bracketPosition,
                homeColor: match.homeColor,
                awayColor: match.awayColor,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                status: match.status,
                scheduledAt: match.scheduledAt,
                winner,
                nextMatchId: match.nextMatchId
            })

            return acc
        }, {})

        // Convert to array and sort
        const bracketRounds = Object.values(rounds).sort((a: any, b: any) => a.roundNumber - b.roundNumber)

        return NextResponse.json({
            event: {
                id: event.id,
                name: event.name,
                sportType: event.sportType,
                tournamentType: event.tournamentType,
                totalRounds: event.totalRounds,
                status: event.status
            },
            bracket: bracketRounds,
            totalMatches: event.matches.length,
            completedMatches: event.matches.filter(m => m.status === 'COMPLETED').length
        })
    } catch (error: any) {
        console.error('[BRACKET_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
