import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/athletes/[id]/stats - Get athlete statistics
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const [registrations, votes, awardWinners] = await Promise.all([
            prisma.eventRegistration.findMany({
                where: { athleteId: id },
                include: {
                    event: {
                        include: {
                            sportType: { select: { name: true } },
                            results: {
                                where: { athleteId: id },
                                select: { id: true, rank: true, points: true, recordedAt: true }
                            }
                        }
                    }
                }
            }),
            prisma.athleteVoteSummary.findMany({
                where: { athleteId: id },
            }),
            prisma.awardWinner.findMany({
                where: { athleteId: id },
                include: { award: { select: { name: true, awardType: true } } }
            })
        ])

        // Process registrations to include their specific results
        const events = registrations.map(reg => ({
            eventId: reg.eventId,
            eventName: reg.event.name,
            sportType: reg.event.sportType.name,
            status: reg.event.status,
            result: reg.event.results[0] || null
        }))

        // Flatten results for easy access and point calculation
        const allResults = registrations
            .flatMap(reg => reg.event.results)
            .filter(r => r !== null)
            .map(r => ({
                id: r.id || 'N/A', // Assuming id might be missing in select
                rank: r.rank,
                points: r.points,
                recordedAt: new Date(), // Mock date as it is not in select
                event: { name: registrations.find(reg => reg.event.results.some(res => res === r))?.event.name } // Find event name
            }))

        // Recalculate flattened results with proper structure for frontend
        const detailedResults = registrations
            .filter(reg => reg.event.results.length > 0)
            .map(reg => {
                const res = reg.event.results[0]
                return {
                    id: reg.eventId, // Using eventID as key since result ID might be partial
                    rank: res.rank,
                    points: res.points,
                    recordedAt: res.recordedAt, // Use actual date
                    event: { name: reg.event.name }
                }
            })

        const totalPoints = detailedResults.reduce((acc, curr) => acc + curr.points, 0)
        const goldMedals = detailedResults.filter(r => r.rank === 1).length

        const stats = {
            summary: { // Wrap in summary object to match frontend expectation
                totalEvents: registrations.length,
                totalVotes: votes.reduce((acc, curr) => acc + curr.totalVotes, 0),
                totalPoints: totalPoints,
                goldMedals: goldMedals
            },
            awards: awardWinners.map(aw => ({
                id: aw.id,
                name: aw.award.name,
                type: aw.award.awardType,
                rank: aw.rank
            })),
            results: detailedResults, // Add the results array that frontend expects
            events,
            voteSummaries: votes.map(v => ({
                eventId: v.eventId,
                totalVotes: v.totalVotes,
                rank: v.rank
            }))
        }

        return NextResponse.json(stats)
    } catch (error: any) {
        console.error('[ATHLETE_STATS_GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
