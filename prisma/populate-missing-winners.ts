import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🏆 Assigning winners to remaining awards...')

    // 1. Get all awards that don't have winners yet
    const awards = await prisma.award.findMany({
        include: {
            winners: true
        }
    })

    const emptyAwards = awards.filter(a => a.winners.length === 0)
    console.log(`Found ${emptyAwards.length} awards without winners.`)

    if (emptyAwards.length === 0) {
        console.log('All awards already have winners!')
        return
    }

    // 2. Get candidates (Athletes)
    const athletes = await prisma.athlete.findMany({
        include: {
            registrations: {
                include: {
                    event: {
                        include: { sportType: true }
                    }
                }
            }
        }
    })

    for (const award of emptyAwards) {
        let winnerCandidate = null

        // Try to match award name to sport type for realism
        // e.g., "MVP บาสเกตบอล" -> Find athlete who played Basketball
        const relevantAthlete = athletes.find(a =>
            a.registrations.some(r => award.name.includes(r.event.sportType.name))
        )

        if (relevantAthlete) {
            winnerCandidate = relevantAthlete
        } else {
            // Fallback: Pick random athlete
            winnerCandidate = athletes[Math.floor(Math.random() * athletes.length)]
        }

        if (winnerCandidate) {
            console.log(`  - Must award "${award.name}" to ${winnerCandidate.firstName} (${winnerCandidate.registrations[0]?.event.sportType.name || 'Random'})`)

            await prisma.awardWinner.create({
                data: {
                    awardId: award.id,
                    athleteId: winnerCandidate.id,
                    rank: 1,
                    announcedAt: new Date()
                }
            })
        }
    }

    console.log('✅ All awards have been assigned!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
