import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, EventStatus, Role, SportCategory, RegistrationStatus, AnnouncementType, ActionType, AwardType } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🚀 Starting COMPREHENSIVE data population...')

    // 1. Pre-population Cleanup (Optional, but useful for clean testing)
    // Keep base data (Colors, SportTypes, Rules) but clean up transactional data
    // Careful: This might be dangerous if user has important data. 
    // I will stick to adding more data instead of deleting.

    // 2. Get existing data
    const colors = await prisma.color.findMany()
    const athletes = await prisma.athlete.findMany({ include: { major: true } })
    const sportTypes = await prisma.sportType.findMany()
    const scoringRules = await prisma.scoringRule.findMany({ orderBy: { rank: 'asc' } })
    const users = await prisma.user.findMany()

    if (colors.length === 0 || athletes.length === 0 || sportTypes.length === 0) {
        console.error('❌ Base data missing. Please run seed first.')
        return
    }

    console.log(`Found ${colors.length} colors, ${athletes.length} athletes, ${sportTypes.length} sport types, and ${users.length} users.`)

    // 3. Create Vote Settings for Existing Events (that don't have them)
    console.log('Setting up Vote Settings...')
    const events = await prisma.event.findMany({ include: { voteSettings: true } })
    for (const event of events) {
        if (!event.voteSettings) {
            await prisma.voteSetting.create({
                data: {
                    eventId: event.id,
                    votingEnabled: true,
                    votingStart: new Date(Date.now() - 86400000), // Started yesterday
                    votingEnd: new Date(Date.now() + 86400000),   // Ends tomorrow
                    maxVotesPerUser: 1,
                    showRealtimeResults: true
                }
            })
        }
    }

    // 4. Create Announcements
    console.log('Creating announcements...')
    const announcementData = [
        { title: 'ยินดีต้อนรับสู่ปี 2024!', content: 'ขอเชิญน้องๆ พี่ๆ ทุกคนมาร่วมสนุกกับงานกีฬาประจำปีของเรา', type: AnnouncementType.GENERAL },
        { title: 'ขยายเวลาลงทะเบียน!', content: 'ขยายเวลาลงทะเบียนนักกีฬาจนถึงเที่ยงคืนวันนี้เท่านั้น', type: AnnouncementType.URGENT },
        { title: 'ประกาศผลฟุตบอลชาย', content: 'สีแดงคว้าแชมป์ฟุตบอลชายประจำปีนี้ไปครองอย่างสมศักดิ์ศรี', type: AnnouncementType.RESULT },
        { title: 'แจ้งเปลี่ยนตารางการแข่งขัน', content: 'เนื่องจากอาจมีฝนตก การแข่งขันกลางแจ้งจะเลื่อนเวลาออกไป 1 ชม.', type: AnnouncementType.URGENT },
    ]

    for (const ann of announcementData) {
        await prisma.announcement.create({
            data: {
                ...ann,
                createdBy: users[0]?.id
            }
        })
    }

    // 5. Generate Activity Logs
    console.log('Generating activity logs...')
    const randomUsers = users.slice(0, 5)
    const logActions = [ActionType.CREATE, ActionType.UPDATE, ActionType.DELETE, ActionType.LOGIN]
    const tableNames = ['events', 'athletes', 'event_results', 'users']

    for (let i = 0; i < 50; i++) {
        const user = randomUsers[Math.floor(Math.random() * randomUsers.length)]
        await prisma.activityLog.create({
            data: {
                userId: user?.id,
                action: logActions[Math.floor(Math.random() * logActions.length)],
                tableName: tableNames[Math.floor(Math.random() * tableNames.length)],
                recordId: 'sample-id-' + i,
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                createdAt: new Date(Date.now() - Math.random() * 864000000) // Within 10 days
            }
        })
    }

    // 6. Create Awards
    console.log('Creating awards and winners...')
    const awards = [
        { name: 'ถ้วยแชมป์รวม (Overall Champion)', description: 'สำหรับสีที่มีคะแนนรวมสูงสุด', type: AwardType.OVERALL },
        { name: 'นักกีฬายอดเยี่ยม (MVP)', description: 'สำหรับนักกีฬาที่ทำผลงานโดดเด่นที่สุด', type: AwardType.SPECIAL },
        { name: 'ขวัญใจมหาชน (Popular Vote)', description: 'รางวัลยอดคะแนนโหวตสูงสุด', type: AwardType.SPECIAL },
        { name: 'รางวัลสปิริตยอดเยี่ยม', description: 'สำหรับสีที่มีระเบียบวินัยและน้ำใจนักกีฬาสูงสุด', type: AwardType.OVERALL },
    ]

    for (const aw of awards) {
        const award = await prisma.award.create({
            data: {
                name: aw.name,
                description: aw.description,
                awardType: aw.type,
                displayOrder: awards.indexOf(aw)
            }
        })

        // Pick a winner for completed awards
        if (aw.type === AwardType.SPECIAL) {
            const randomAthlete = athletes[Math.floor(Math.random() * athletes.length)]
            await prisma.awardWinner.create({
                data: {
                    awardId: award.id,
                    athleteId: randomAthlete.id,
                    rank: 1,
                    announcedAt: new Date()
                }
            })
        }
    }

    // 7. Generate Extra Registrations and Results (to make it look busy)
    console.log('Adding more competition data...')
    const extraEventNames = [
        { name: 'วิ่งวิบาก', type: 'วิ่ง 100 เมตร ชาย' },
        { name: 'เป่ายิ้งฉุบ แชมเปี้ยนชิพ', type: 'ปิงปอง' },
        { name: 'กินวิบาก', type: 'ชักเย่อ' }
    ]

    for (const ex of extraEventNames) {
        const sport = sportTypes.find(s => s.name === ex.type) || sportTypes[0]
        const event = await prisma.event.create({
            data: {
                name: ex.name,
                sportTypeId: sport.id,
                status: EventStatus.COMPLETED,
                date: new Date(),
                time: '10:00',
                location: 'สนามกีฬาในร่ม'
            }
        })

        // Register 1 athlete per color
        const eventAthletes = []
        for (const color of colors) {
            const athlete = athletes.find(a => a.colorId === color.id)
            if (athlete) {
                await prisma.eventRegistration.create({
                    data: {
                        eventId: event.id,
                        athleteId: athlete.id,
                        colorId: color.id
                    }
                })
                eventAthletes.push(athlete)
            }
        }

        // Add results
        const shuffled = [...eventAthletes].sort(() => 0.5 - Math.random())
        for (let r = 1; r <= 3; r++) {
            const winner = shuffled[r - 1]
            if (!winner) continue
            const points = scoringRules.find(rule => rule.rank === r)?.points || 0

            await prisma.eventResult.create({
                data: {
                    eventId: event.id,
                    colorId: winner.colorId,
                    athleteId: winner.id,
                    rank: r,
                    points: points
                }
            })

            // Update color total
            await prisma.color.update({
                where: { id: winner.colorId },
                data: { totalScore: { increment: points } }
            })
        }
    }

    // 8. Generate Vote Summaries (Initial Aggregation)
    console.log('Calculating initial vote summaries...')
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
            update: {
                totalVotes: vc._count._all
            },
            create: {
                athleteId: vc.athleteId,
                eventId: vc.eventId,
                totalVotes: vc._count._all
            }
        })
    }

    console.log('\n✅ COMPREHENSIVE test data populated successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Population failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
