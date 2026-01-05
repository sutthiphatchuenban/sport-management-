import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('--- Awards Check ---')
    try {
        const awards = await prisma.award.findMany()
        console.log(`Awards found: ${awards.length}`)
        awards.forEach(a => console.log(`- ${a.name} (${a.awardType})`))

        console.log('\n--- Winners Check ---')
        const winners = await prisma.awardWinner.findMany({
            include: {
                award: true,
                athlete: {
                    select: {
                        firstName: true,
                        color: { select: { name: true } }
                    }
                }
            }
        })
        console.log(`Winners found: ${winners.length}`)
        winners.forEach(w => console.log(`- ${w.award.name}: ${w.athlete.firstName} (สี${w.athlete.color.name})`))
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
