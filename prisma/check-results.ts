import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('--- Database Check ---')

    const colors = await prisma.color.findMany()
    console.log(`Colors: ${colors.length}`)
    colors.forEach(c => console.log(`  - ${c.name}: ${c.totalScore} pts`))

    const events = await prisma.event.findMany({
        include: { _count: { select: { results: true, registrations: true } } }
    })
    console.log(`\nEvents: ${events.length}`)
    events.forEach(e => {
        console.log(`  - ${e.name} (${e.status}): ${e._count.results} results, ${e._count.registrations} registrations`)
    })

    const results = await prisma.eventResult.findMany({
        take: 5,
        orderBy: { recordedAt: 'desc' },
        include: {
            event: { select: { name: true } },
            color: { select: { name: true } }
        }
    })
    console.log(`\nTotal Event Results: ${await prisma.eventResult.count()}`)
    console.log('Last 5 results:', JSON.stringify(results, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
