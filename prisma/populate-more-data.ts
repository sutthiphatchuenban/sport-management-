import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, EventStatus, Role, SportCategory, RegistrationStatus, AnnouncementType, ActionType, AwardType } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🚀 Starting EXTENDED data population (Phase 2)...')

    // 1. Get existing data
    const colors = await prisma.color.findMany()
    const athletes = await prisma.athlete.findMany({ include: { major: true } })
    const sportTypes = await prisma.sportType.findMany()
    const users = await prisma.user.findMany()
    const events = await prisma.event.findMany()

    if (colors.length === 0 || athletes.length === 0 || sportTypes.length === 0) {
        console.error('❌ Base data missing. Please run seed/populate first.')
        return
    }

    // 2. Add More Announcements
    console.log('Adding more announcements...')
    const extraAnnouncements = [
        { title: 'พยากรณ์อากาศวันนี้', content: 'วันนี้อากาศแจ่มใส เหมาะแก่การแข่งขันกีฬากลางแจ้ง', type: AnnouncementType.GENERAL },
        { title: 'แจ้งเตือนนักกีฬากรีฑา', content: 'กรุณามารายงานตัวที่จุดลงทะเบียนก่อนเวลา 30 นาที', type: AnnouncementType.URGENT },
        { title: 'สรุปเหรียญรางวัลวันที่ 1', content: 'สีเหลืองนำโด่งด้วยคะแนนรวม 50 คะแนน!', type: AnnouncementType.RESULT },
        { title: 'กิจกรรมพิเศษพักเที่ยง', content: 'มีการแสดงดนตรีสดจากชมรมดนตรีสากล ณ ลานกิจกรรม', type: AnnouncementType.GENERAL },
    ]

    for (const ann of extraAnnouncements) {
        await prisma.announcement.create({
            data: { ...ann, createdBy: users[0]?.id }
        })
    }

    // 3. Populate Activity Logs (Heavy Load)
    console.log('Generating heavy activity logs...')
    const actions = [ActionType.CREATE, ActionType.UPDATE, ActionType.DELETE, ActionType.LOGIN, ActionType.LOGOUT]
    const tables = ['events', 'athletes', 'event_results', 'users', 'votes', 'announcements']

    for (let i = 0; i < 100; i++) {
        const user = users[Math.floor(Math.random() * users.length)]
        await prisma.activityLog.create({
            data: {
                userId: user?.id,
                action: actions[Math.floor(Math.random() * actions.length)],
                tableName: tables[Math.floor(Math.random() * tables.length)],
                recordId: `mock-id-${Date.now()}-${i}`,
                oldValue: i % 2 === 0 ? { status: 'PENDING' } : undefined,
                newValue: (i % 2 === 0 ? { status: 'COMPLETED' } : { name: `New Item ${i}` }) as any,
                ipAddress: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
            }
        })
    }

    // 4. More Votes (to test leaderboard dynamics)
    console.log('Casting lots of votes...')
    const targetAthletes = athletes.sort(() => 0.5 - Math.random()).slice(0, 10) // Pick 10 popular athletes

    for (let i = 0; i < 300; i++) {
        const athlete = targetAthletes[Math.floor(Math.random() * targetAthletes.length)]
        const event = events.length > 0 ? events[Math.floor(Math.random() * events.length)] : null

        await prisma.vote.create({
            data: {
                athleteId: athlete.id,
                eventId: event?.id || events[0].id, // Ensure eventId is present
                voterIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
                votedAt: new Date(Date.now() - Math.random() * 100000000)
            }
        })
    }

    // Recalculate vote summaries
    console.log('Updating vote summaries...')
    const voteCounts = await prisma.vote.groupBy({
        by: ['athleteId', 'eventId'],
        _count: { _all: true }
    })

    for (const vc of voteCounts) {
        await prisma.athleteVoteSummary.upsert({
            where: {
                athleteId_eventId: {
                    athleteId: vc.athleteId,
                    eventId: vc.eventId
                }
            },
            update: { totalVotes: vc._count._all },
            create: {
                athleteId: vc.athleteId,
                eventId: vc.eventId,
                totalVotes: vc._count._all
            }
        })
    }

    // 5. Add more events for Calendar/Schedule testing
    console.log('Scheduling future events...')
    const scheduleEvents = [
        { name: 'บาสเกตบอลชิงชนะเลิศ', type: 'บาสเกตบอล', days: 1 },
        { name: 'ฟุตซอลรอบแรก', type: 'ฟุตบอล', days: 2 },
        { name: 'แบดมินตันหญิงเดี่ยว', type: 'แบดมินตัน', days: 3 },
        { name: 'E-Sport (Module Legend) Final', type: 'E-Sport (ROV)', days: 1 },
    ]

    for (const se of scheduleEvents) {
        const sport = sportTypes.find(s => s.name === se.type) || sportTypes[0]
        await prisma.event.create({
            data: {
                name: se.name,
                sportTypeId: sport.id,
                status: EventStatus.UPCOMING,
                date: new Date(Date.now() + se.days * 24 * 60 * 60 * 1000), // Future date
                time: '09:00',
                location: 'Main Stadium'
            }
        })
    }

    console.log('\n✅ EXTENDED test data populated successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Population failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
