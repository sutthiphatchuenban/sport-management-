import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, EventStatus, AnnouncementType, ActionType, AwardType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Starting COMPREHENSIVE seed...')
    console.log('═'.repeat(50))

    // ============================================================
    // PHASE 1: BASE DATA (Colors, Majors, Sport Types, Scoring Rules)
    // ============================================================
    console.log('\n📦 PHASE 1: Creating base data...')

    // 1. Create Colors (Teams)
    console.log('  Creating colors...')
    const colors = await Promise.all([
        prisma.color.upsert({
            where: { name: 'แดง' },
            update: {},
            create: { name: 'แดง', hexCode: '#EF4444', totalScore: 0 },
        }),
        prisma.color.upsert({
            where: { name: 'เหลือง' },
            update: {},
            create: { name: 'เหลือง', hexCode: '#EAB308', totalScore: 0 },
        }),
        prisma.color.upsert({
            where: { name: 'เขียว' },
            update: {},
            create: { name: 'เขียว', hexCode: '#22C55E', totalScore: 0 },
        }),
        prisma.color.upsert({
            where: { name: 'น้ำเงิน' },
            update: {},
            create: { name: 'น้ำเงิน', hexCode: '#3B82F6', totalScore: 0 },
        }),
    ])
    console.log(`  ✅ Created ${colors.length} colors`)

    // 2. Create Majors
    console.log('  Creating majors...')
    const majors = await Promise.all([
        prisma.major.upsert({
            where: { code: 'IT' },
            update: {},
            create: { name: 'เทคโนโลยีสารสนเทศ', code: 'IT', colorId: colors[0].id },
        }),
        prisma.major.upsert({
            where: { code: 'CS' },
            update: {},
            create: { name: 'วิทยาการคอมพิวเตอร์', code: 'CS', colorId: colors[1].id },
        }),
        prisma.major.upsert({
            where: { code: 'GIS' },
            update: {},
            create: { name: 'ภูมิสารสนเทศศาสตร์', code: 'GIS', colorId: colors[2].id },
        }),
        prisma.major.upsert({
            where: { code: 'IMM' },
            update: {},
            create: { name: 'สื่อนฤมิต', code: 'IMM', colorId: colors[3].id },
        }),
    ])
    console.log(`  ✅ Created ${majors.length} majors`)

    // 3. Create Sport Types (use findFirst + create pattern)
    console.log('  Creating sport types...')
    const sportTypeData = [
        { name: 'วิ่ง 100 เมตร ชาย', category: 'INDIVIDUAL' as const, maxParticipants: 4 },
        { name: 'วิ่ง 100 เมตร หญิง', category: 'INDIVIDUAL' as const, maxParticipants: 4 },
        { name: 'วิ่งผลัด 4x100 เมตร', category: 'TEAM' as const, maxParticipants: 4 },
        { name: 'ฟุตบอล', category: 'TEAM' as const, maxParticipants: 11 },
        { name: 'บาสเกตบอล', category: 'TEAM' as const, maxParticipants: 5 },
        { name: 'วอลเลย์บอล', category: 'TEAM' as const, maxParticipants: 6 },
        { name: 'แบดมินตัน', category: 'INDIVIDUAL' as const, maxParticipants: 2 },
        { name: 'ปิงปอง', category: 'INDIVIDUAL' as const, maxParticipants: 2 },
        { name: 'E-Sport (ROV)', category: 'TEAM' as const, maxParticipants: 5 },
        { name: 'ชักเย่อ', category: 'TEAM' as const, maxParticipants: 10 },
    ]

    const sportTypes = []
    for (const sport of sportTypeData) {
        let existing = await prisma.sportType.findFirst({ where: { name: sport.name } })
        if (!existing) {
            existing = await prisma.sportType.create({ data: sport })
        }
        sportTypes.push(existing)
    }
    console.log(`  ✅ Created ${sportTypes.length} sport types`)

    // 4. Create Default Scoring Rules (use findFirst + create pattern)
    console.log('  Creating scoring rules...')
    const scoringRulesData = [
        { rank: 1, points: 10 },
        { rank: 2, points: 8 },
        { rank: 3, points: 6 },
        { rank: 4, points: 4 },
    ]

    const scoringRules = []
    for (const rule of scoringRulesData) {
        let existing = await prisma.scoringRule.findFirst({ where: { rank: rule.rank, eventId: null } })
        if (!existing) {
            existing = await prisma.scoringRule.create({ data: rule })
        }
        scoringRules.push(existing)
    }
    console.log(`  ✅ Created ${scoringRules.length} scoring rules`)

    // ============================================================
    // PHASE 2: USERS (Admin, Organizer, Team Managers, Viewers)
    // ============================================================
    console.log('\n👥 PHASE 2: Creating users...')

    // Admin User
    console.log('  Creating admin user...')
    const hashedAdminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedAdminPassword,
            role: 'ADMIN',
            isActive: true,
        },
    })
    console.log(`  ✅ Created admin: ${admin.username}`)

    // Organizer
    console.log('  Creating organizer...')
    const hashedOrganizerPassword = await bcrypt.hash('organizer123', 10)
    const organizer = await prisma.user.upsert({
        where: { username: 'organizer' },
        update: {},
        create: {
            username: 'organizer',
            email: 'organizer@example.com',
            password: hashedOrganizerPassword,
            role: 'ORGANIZER',
            isActive: true,
        },
    })
    console.log(`  ✅ Created organizer: ${organizer.username}`)

    // Team Managers
    console.log('  Creating team managers...')
    const hashedManagerPassword = await bcrypt.hash('manager123', 10)
    const teamManagers = await Promise.all(
        majors.map((major, index) =>
            prisma.user.upsert({
                where: { username: `manager_${major.code.toLowerCase()}` },
                update: {},
                create: {
                    username: `manager_${major.code.toLowerCase()}`,
                    email: `manager.${major.code.toLowerCase()}@example.com`,
                    password: hashedManagerPassword,
                    role: 'TEAM_MANAGER',
                    majorId: major.id,
                    colorId: colors[index].id,
                    isActive: true,
                },
            })
        )
    )
    console.log(`  ✅ Created ${teamManagers.length} team managers`)

    // Viewer Users
    console.log('  Creating viewer users...')
    const hashedViewerPassword = await bcrypt.hash('viewer123', 10)
    const viewers = await Promise.all([
        prisma.user.upsert({
            where: { username: 'viewer1' },
            update: {},
            create: {
                username: 'viewer1',
                email: 'viewer1@example.com',
                password: hashedViewerPassword,
                role: 'VIEWER',
                isActive: true,
            },
        }),
        prisma.user.upsert({
            where: { username: 'viewer2' },
            update: {},
            create: {
                username: 'viewer2',
                email: 'viewer2@example.com',
                password: hashedViewerPassword,
                role: 'VIEWER',
                isActive: true,
            },
        }),
    ])
    console.log(`  ✅ Created ${viewers.length} viewer users`)

    // ============================================================
    // PHASE 3: ATHLETES (40 athletes, 10 per color)
    // ============================================================
    console.log('\n🏃 PHASE 3: Creating athletes...')

    const athleteNames = [
        { firstName: 'สมชาย', lastName: 'ใจดี' },
        { firstName: 'สมหญิง', lastName: 'รักเรียน' },
        { firstName: 'มานะ', lastName: 'พยายาม' },
        { firstName: 'มานี', lastName: 'ขยัน' },
        { firstName: 'วิชัย', lastName: 'เก่ง' },
        { firstName: 'วิชาญ', lastName: 'มั่นคง' },
        { firstName: 'ประภา', lastName: 'สว่าง' },
        { firstName: 'ประภาส', lastName: 'แจ่มใส' },
        { firstName: 'กิตติ', lastName: 'ยศไพศาล' },
        { firstName: 'กิตติพงษ์', lastName: 'เจริญรุ่ง' },
    ]

    const createdAthletes = []
    for (let colorIdx = 0; colorIdx < 4; colorIdx++) {
        for (let j = 0; j < 10; j++) {
            const nameData = athleteNames[j]
            const studentId = `6${5 + colorIdx}0${(j + 1).toString().padStart(3, '0')}0${j + 1}`

            let athlete = await prisma.athlete.findUnique({ where: { studentId } })
            if (!athlete) {
                athlete = await prisma.athlete.create({
                    data: {
                        studentId,
                        firstName: `${nameData.firstName}${j + 1}`,
                        lastName: `${nameData.lastName} สี${colors[colorIdx].name}`,
                        nickname: `น้อง${colors[colorIdx].name.charAt(0)}${j + 1}`,
                        majorId: majors[colorIdx].id,
                        colorId: colors[colorIdx].id,
                        registeredBy: teamManagers[colorIdx].id,
                    },
                })
            }
            createdAthletes.push(athlete)
        }
    }
    console.log(`  ✅ Created ${createdAthletes.length} athletes`)

    // ============================================================
    // PHASE 4: EVENTS & REGISTRATIONS
    // ============================================================
    console.log('\n🏆 PHASE 4: Creating events and registrations...')

    // Main Events (Completed with results)
    const mainEventsData = [
        { name: 'ฟุตบอลชาย รอบชิงชนะเลิศ', sportType: 'ฟุตบอล', status: EventStatus.COMPLETED, daysAgo: 3 },
        { name: 'บาสเกตบอลชาย รอบชิงชนะเลิศ', sportType: 'บาสเกตบอล', status: EventStatus.COMPLETED, daysAgo: 2 },
        { name: 'วิ่ง 100 เมตร ชาย รอบชิงชนะเลิศ', sportType: 'วิ่ง 100 เมตร ชาย', status: EventStatus.COMPLETED, daysAgo: 1 },
        { name: 'วอลเลย์บอลหญิง รอบชิงชนะเลิศ', sportType: 'วอลเลย์บอล', status: EventStatus.COMPLETED, daysAgo: 1 },
        { name: 'ชักเย่อผสม รอบชิงชนะเลิศ', sportType: 'ชักเย่อ', status: EventStatus.COMPLETED, daysAgo: 0 },
    ]

    // Extra Events (More variety)
    const extraEventsData = [
        { name: 'วิ่งวิบาก', sportType: 'วิ่ง 100 เมตร ชาย', status: EventStatus.COMPLETED, daysAgo: 4 },
        { name: 'เป่ายิ้งฉุบ แชมเปี้ยนชิพ', sportType: 'ปิงปอง', status: EventStatus.COMPLETED, daysAgo: 4 },
        { name: 'กินวิบาก', sportType: 'ชักเย่อ', status: EventStatus.COMPLETED, daysAgo: 5 },
    ]

    // Future Events (Upcoming)
    const futureEventsData = [
        { name: 'บาสเกตบอลชิงชนะเลิศ หญิง', sportType: 'บาสเกตบอล', status: EventStatus.UPCOMING, daysLater: 1 },
        { name: 'ฟุตซอลรอบแรก', sportType: 'ฟุตบอล', status: EventStatus.UPCOMING, daysLater: 2 },
        { name: 'แบดมินตันหญิงเดี่ยว', sportType: 'แบดมินตัน', status: EventStatus.UPCOMING, daysLater: 3 },
        { name: 'E-Sport (ROV) Final', sportType: 'E-Sport (ROV)', status: EventStatus.UPCOMING, daysLater: 4 },
        { name: 'ปิงปองคู่ผสม', sportType: 'ปิงปอง', status: EventStatus.UPCOMING, daysLater: 5 },
    ]

    // Ongoing Events
    const ongoingEventsData = [
        { name: 'แบดมินตันชายคู่ รอบรองชนะเลิศ', sportType: 'แบดมินตัน', status: EventStatus.ONGOING },
        { name: 'วิ่ง 100 เมตร หญิง รอบคัดเลือก', sportType: 'วิ่ง 100 เมตร หญิง', status: EventStatus.ONGOING },
    ]

    interface EventDataType {
        name: string
        sportType: string
        status: EventStatus
        date: Date
    }

    const allEventsData: EventDataType[] = [
        ...mainEventsData.map(e => ({ name: e.name, sportType: e.sportType, status: e.status, date: new Date(Date.now() - e.daysAgo * 24 * 60 * 60 * 1000) })),
        ...extraEventsData.map(e => ({ name: e.name, sportType: e.sportType, status: e.status, date: new Date(Date.now() - e.daysAgo * 24 * 60 * 60 * 1000) })),
        ...futureEventsData.map(e => ({ name: e.name, sportType: e.sportType, status: e.status, date: new Date(Date.now() + e.daysLater * 24 * 60 * 60 * 1000) })),
        ...ongoingEventsData.map(e => ({ name: e.name, sportType: e.sportType, status: e.status, date: new Date() })),
    ]

    const createdEvents = []
    for (const eventData of allEventsData) {
        const sport = sportTypes.find(s => s.name === eventData.sportType) || sportTypes[0]

        // Check if event already exists
        let event = await prisma.event.findFirst({ where: { name: eventData.name } })
        if (!event) {
            event = await prisma.event.create({
                data: {
                    name: eventData.name,
                    sportTypeId: sport.id,
                    status: eventData.status,
                    date: eventData.date,
                    time: '09:00',
                    location: sport.category === 'INDIVIDUAL' ? 'สนามกรีฑา' : 'อาคารกีฬา',
                    createdById: organizer.id,
                },
            })
        }
        createdEvents.push(event)

        // Create Vote Settings for each event
        const existingVoteSettings = await prisma.voteSetting.findFirst({ where: { eventId: event.id } })
        if (!existingVoteSettings) {
            await prisma.voteSetting.create({
                data: {
                    eventId: event.id,
                    votingEnabled: eventData.status === EventStatus.ONGOING || eventData.status === EventStatus.COMPLETED,
                    votingStart: new Date(Date.now() - 86400000),
                    votingEnd: new Date(Date.now() + 86400000 * 3),
                    maxVotesPerUser: 1,
                    showRealtimeResults: true,
                },
            })
        }

        // Create registrations for completed and ongoing events
        if (eventData.status === EventStatus.COMPLETED || eventData.status === EventStatus.ONGOING) {
            for (const color of colors) {
                const athletesOfColor = createdAthletes.filter(a => a.colorId === color.id)
                const selectedAthletes = athletesOfColor.slice(0, Math.min(3, athletesOfColor.length))

                for (const athlete of selectedAthletes) {
                    const existingReg = await prisma.eventRegistration.findUnique({
                        where: {
                            eventId_athleteId: {
                                eventId: event.id,
                                athleteId: athlete.id,
                            },
                        },
                    })
                    if (!existingReg) {
                        await prisma.eventRegistration.create({
                            data: {
                                eventId: event.id,
                                athleteId: athlete.id,
                                colorId: color.id,
                                status: 'CONFIRMED',
                            },
                        })
                    }
                }
            }
        }
    }
    console.log(`  ✅ Created ${createdEvents.length} events with registrations`)

    // ============================================================
    // PHASE 5: EVENT RESULTS & SCORE CALCULATION
    // ============================================================
    console.log('\n📊 PHASE 5: Creating event results and calculating scores...')

    const completedEvents = createdEvents.filter(e => e.status === EventStatus.COMPLETED)
    let totalResults = 0

    for (const event of completedEvents) {
        // Check if results already exist
        const existingResults = await prisma.eventResult.count({ where: { eventId: event.id } })
        if (existingResults > 0) continue

        // Shuffle colors for random ranking
        const shuffledColors = [...colors].sort(() => Math.random() - 0.5)

        for (let rank = 1; rank <= Math.min(4, shuffledColors.length); rank++) {
            const color = shuffledColors[rank - 1]
            const athletesOfColor = createdAthletes.filter(a => a.colorId === color.id)
            const athlete = athletesOfColor[Math.floor(Math.random() * athletesOfColor.length)]
            const rule = scoringRules.find(r => r.rank === rank)
            const points = rule?.points || 0

            await prisma.eventResult.create({
                data: {
                    eventId: event.id,
                    colorId: color.id,
                    athleteId: athlete?.id,
                    rank: rank,
                    points: points,
                    recordedBy: organizer.id,
                },
            })

            // Update color total score
            await prisma.color.update({
                where: { id: color.id },
                data: { totalScore: { increment: points } },
            })

            totalResults++
        }
    }
    console.log(`  ✅ Created ${totalResults} event results`)

    // ============================================================
    // PHASE 6: AWARDS & WINNERS
    // ============================================================
    console.log('\n🏅 PHASE 6: Creating awards and winners...')

    const awardsData = [
        { name: 'นักกีฬายอดเยี่ยม', description: 'รางวัลสำหรับนักกีฬาที่ได้รับคะแนนโหวตสูงสุด', awardType: AwardType.OVERALL, displayOrder: 1 },
        { name: 'ถ้วยแชมป์รวม (Overall Champion)', description: 'สำหรับสีที่มีคะแนนรวมสูงสุด', awardType: AwardType.OVERALL, displayOrder: 2 },
        { name: 'MVP ฟุตบอล', description: 'นักกีฬายอดเยี่ยมประเภทฟุตบอล', awardType: AwardType.CATEGORY, category: 'ฟุตบอล', displayOrder: 3 },
        { name: 'MVP บาสเกตบอล', description: 'นักกีฬายอดเยี่ยมประเภทบาสเกตบอล', awardType: AwardType.CATEGORY, category: 'บาสเกตบอล', displayOrder: 4 },
        { name: 'MVP วอลเลย์บอล', description: 'นักกีฬายอดเยี่ยมประเภทวอลเลย์บอล', awardType: AwardType.CATEGORY, category: 'วอลเลย์บอล', displayOrder: 5 },
        { name: 'MVP วิ่ง', description: 'นักกีฬายอดเยี่ยมประเภทกรีฑา', awardType: AwardType.CATEGORY, category: 'วิ่ง 100 เมตร ชาย', displayOrder: 6 },
        { name: 'รางวัลน้ำใจนักกีฬา', description: 'รางวัลพิเศษสำหรับผู้ที่มีน้ำใจนักกีฬาดีเด่น', awardType: AwardType.SPECIAL, displayOrder: 7 },
        { name: 'ขวัญใจมหาชน (Popular Vote)', description: 'รางวัลยอดคะแนนโหวตสูงสุด', awardType: AwardType.SPECIAL, displayOrder: 8 },
        { name: 'รางวัลสปิริตยอดเยี่ยม', description: 'สำหรับสีที่มีระเบียบวินัยและน้ำใจนักกีฬาสูงสุด', awardType: AwardType.OVERALL, displayOrder: 9 },
    ]

    const createdAwards = []
    for (const awardData of awardsData) {
        // Check if award exists
        let award = await prisma.award.findFirst({ where: { name: awardData.name } })
        if (!award) {
            award = await prisma.award.create({ data: awardData })
        }
        createdAwards.push(award)

        // Assign winners for completed awards (SPECIAL and some CATEGORY)
        if (awardData.awardType === AwardType.SPECIAL || (awardData.awardType === AwardType.CATEGORY && Math.random() > 0.5)) {
            const existingWinner = await prisma.awardWinner.findFirst({ where: { awardId: award.id } })
            if (!existingWinner) {
                const randomAthlete = createdAthletes[Math.floor(Math.random() * createdAthletes.length)]
                await prisma.awardWinner.create({
                    data: {
                        awardId: award.id,
                        athleteId: randomAthlete.id,
                        rank: 1,
                        votesReceived: Math.floor(Math.random() * 200) + 50,
                        announcedAt: new Date(),
                    },
                })
            }
        }
    }
    console.log(`  ✅ Created ${createdAwards.length} awards with winners`)

    // ============================================================
    // PHASE 7: VOTES & VOTE SUMMARIES
    // ============================================================
    console.log('\n🗳️ PHASE 7: Creating votes and summaries...')

    // Check existing votes count
    const existingVotesCount = await prisma.vote.count()
    const targetVotes = 500

    // Generate votes spread across athletes and events
    const votableEvents = createdEvents.filter(e =>
        e.status === EventStatus.COMPLETED || e.status === EventStatus.ONGOING
    )

    let voteCount = 0
    const popularAthletes = createdAthletes.slice(0, 15) // Top 15 athletes get more votes

    if (existingVotesCount < targetVotes && votableEvents.length > 0) {
        const votesToCreate = targetVotes - existingVotesCount
        for (let i = 0; i < votesToCreate; i++) {
            const athlete = i < 300
                ? popularAthletes[Math.floor(Math.random() * popularAthletes.length)]
                : createdAthletes[Math.floor(Math.random() * createdAthletes.length)]

            const event = votableEvents[Math.floor(Math.random() * votableEvents.length)]

            await prisma.vote.create({
                data: {
                    athleteId: athlete.id,
                    eventId: event.id,
                    voterIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    voterDeviceId: `device-${Date.now()}-${i}`,
                    votedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                },
            })
            voteCount++
        }
    }
    console.log(`  ✅ Created ${voteCount} new votes (total: ${existingVotesCount + voteCount})`)

    // Calculate vote summaries
    console.log('  Calculating vote summaries...')
    const voteCounts = await prisma.vote.groupBy({
        by: ['athleteId', 'eventId'],
        _count: { _all: true },
    })

    for (const vc of voteCounts) {
        await prisma.athleteVoteSummary.upsert({
            where: {
                athleteId_eventId: {
                    athleteId: vc.athleteId,
                    eventId: vc.eventId,
                },
            },
            update: { totalVotes: vc._count._all },
            create: {
                athleteId: vc.athleteId,
                eventId: vc.eventId,
                totalVotes: vc._count._all,
            },
        })
    }
    console.log(`  ✅ Updated ${voteCounts.length} vote summaries`)

    // ============================================================
    // PHASE 8: ANNOUNCEMENTS
    // ============================================================
    console.log('\n📢 PHASE 8: Creating announcements...')

    const announcementsData = [
        { title: 'ยินดีต้อนรับสู่กีฬาสีประจำปี 2567!', content: 'ขอเชิญน้องๆ พี่ๆ ทุกคนมาร่วมสนุกกับงานกีฬาประจำปีของเรา งานนี้เต็มไปด้วยความสนุกสนานและมิตรภาพ', type: AnnouncementType.GENERAL },
        { title: 'ขยายเวลาลงทะเบียน!', content: 'ขยายเวลาลงทะเบียนนักกีฬาจนถึงเที่ยงคืนวันนี้เท่านั้น รีบสมัครก่อนหมดเขตนะครับ', type: AnnouncementType.URGENT },
        { title: 'ประกาศผลฟุตบอลชายรอบชิง', content: 'ขอแสดงความยินดีกับสีแดงที่คว้าแชมป์ฟุตบอลชายประจำปีนี้ไปครอง! 🏆', type: AnnouncementType.RESULT },
        { title: 'แจ้งเปลี่ยนตารางการแข่งขัน', content: 'เนื่องจากอาจมีฝนตก การแข่งขันกลางแจ้งจะเลื่อนเวลาออกไป 1 ชั่วโมง', type: AnnouncementType.URGENT },
        { title: 'พยากรณ์อากาศวันนี้', content: 'วันนี้อากาศแจ่มใส อุณหภูมิ 28-32 องศา เหมาะแก่การแข่งขันกีฬากลางแจ้ง', type: AnnouncementType.GENERAL },
        { title: 'แจ้งเตือนนักกีฬากรีฑา', content: 'กรุณามารายงานตัวที่จุดลงทะเบียนก่อนเวลา 30 นาที มิฉะนั้นจะถูกตัดสิทธิ์', type: AnnouncementType.URGENT },
        { title: 'สรุปเหรียญรางวัลวันที่ 1', content: 'สีเหลืองนำโด่งด้วยคะแนนรวม 50 คะแนน ตามด้วยสีแดง 42 คะแนน!', type: AnnouncementType.RESULT },
        { title: 'กิจกรรมพิเศษพักเที่ยง', content: 'มีการแสดงดนตรีสดจากชมรมดนตรีสากล ณ ลานกิจกรรมกลาง', type: AnnouncementType.GENERAL },
        { title: 'ขอบคุณผู้สนับสนุน', content: 'ขอขอบคุณผู้สนับสนุนทุกท่านที่ร่วมสนับสนุนงานกีฬาสีในปีนี้', type: AnnouncementType.GENERAL },
        { title: 'ประกาศผลการแข่งขันบาสเกตบอล', content: 'สีเขียวคว้าชัยชนะในการแข่งขันบาสเกตบอลชายรอบชิงชนะเลิศ! 🏀', type: AnnouncementType.RESULT },
    ]

    let announcementCount = 0
    for (const ann of announcementsData) {
        const existing = await prisma.announcement.findFirst({ where: { title: ann.title } })
        if (!existing) {
            await prisma.announcement.create({
                data: {
                    ...ann,
                    createdBy: admin.id,
                },
            })
            announcementCount++
        }
    }
    console.log(`  ✅ Created ${announcementCount} announcements`)

    // ============================================================
    // PHASE 9: ACTIVITY LOGS
    // ============================================================
    console.log('\n📋 PHASE 9: Creating activity logs...')

    const existingLogsCount = await prisma.activityLog.count()
    const targetLogs = 150

    if (existingLogsCount < targetLogs) {
        const allUsers = [admin, organizer, ...teamManagers, ...viewers]
        const actions = [ActionType.CREATE, ActionType.UPDATE, ActionType.DELETE, ActionType.LOGIN, ActionType.LOGOUT]
        const tables = ['events', 'athletes', 'event_results', 'users', 'votes', 'announcements', 'awards']

        const logsToCreate = targetLogs - existingLogsCount
        for (let i = 0; i < logsToCreate; i++) {
            const user = allUsers[Math.floor(Math.random() * allUsers.length)]
            await prisma.activityLog.create({
                data: {
                    userId: user.id,
                    action: actions[Math.floor(Math.random() * actions.length)],
                    tableName: tables[Math.floor(Math.random() * tables.length)],
                    recordId: `record-${Date.now()}-${i}`,
                    oldValue: i % 3 === 0 ? { status: 'PENDING', value: i } : undefined,
                    newValue: i % 3 === 0 ? { status: 'COMPLETED', value: i + 1 } : { name: `Item ${i}` },
                    ipAddress: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
                },
            })
        }
        console.log(`  ✅ Created ${logsToCreate} activity logs`)
    } else {
        console.log(`  ✅ Activity logs already exist (${existingLogsCount})`)
    }

    // ============================================================
    // PHASE 10: DEFAULT VOTE SETTINGS (Global)
    // ============================================================
    console.log('\n⚙️ PHASE 10: Creating default vote settings...')

    const globalVoteSettings = await prisma.voteSetting.findFirst({ where: { eventId: null } })
    if (!globalVoteSettings) {
        await prisma.voteSetting.create({
            data: {
                votingEnabled: true,
                maxVotesPerUser: 1,
                showRealtimeResults: true,
            },
        })
        console.log(`  ✅ Created default vote settings`)
    } else {
        console.log(`  ✅ Default vote settings already exist`)
    }

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log('\n' + '═'.repeat(50))
    console.log('🎉 COMPREHENSIVE SEED COMPLETED SUCCESSFULLY!')
    console.log('═'.repeat(50))

    // Final counts
    const finalCounts = {
        colors: await prisma.color.count(),
        majors: await prisma.major.count(),
        sportTypes: await prisma.sportType.count(),
        scoringRules: await prisma.scoringRule.count(),
        users: await prisma.user.count(),
        athletes: await prisma.athlete.count(),
        events: await prisma.event.count(),
        registrations: await prisma.eventRegistration.count(),
        results: await prisma.eventResult.count(),
        awards: await prisma.award.count(),
        awardWinners: await prisma.awardWinner.count(),
        votes: await prisma.vote.count(),
        voteSummaries: await prisma.athleteVoteSummary.count(),
        announcements: await prisma.announcement.count(),
        activityLogs: await prisma.activityLog.count(),
        voteSettings: await prisma.voteSetting.count(),
    }

    console.log('\n📋 FINAL SUMMARY:')
    console.log('   ─────────────────────────────────')
    console.log(`   Colors:           ${finalCounts.colors}`)
    console.log(`   Majors:           ${finalCounts.majors}`)
    console.log(`   Sport Types:      ${finalCounts.sportTypes}`)
    console.log(`   Scoring Rules:    ${finalCounts.scoringRules}`)
    console.log(`   Users:            ${finalCounts.users}`)
    console.log(`   Athletes:         ${finalCounts.athletes}`)
    console.log(`   Events:           ${finalCounts.events}`)
    console.log(`   Registrations:    ${finalCounts.registrations}`)
    console.log(`   Event Results:    ${finalCounts.results}`)
    console.log(`   Awards:           ${finalCounts.awards}`)
    console.log(`   Award Winners:    ${finalCounts.awardWinners}`)
    console.log(`   Votes:            ${finalCounts.votes}`)
    console.log(`   Vote Summaries:   ${finalCounts.voteSummaries}`)
    console.log(`   Announcements:    ${finalCounts.announcements}`)
    console.log(`   Activity Logs:    ${finalCounts.activityLogs}`)
    console.log(`   Vote Settings:    ${finalCounts.voteSettings}`)
    console.log('   ─────────────────────────────────')

    console.log('\n🔐 DEFAULT CREDENTIALS:')
    console.log('   ─────────────────────────────────')
    console.log('   Admin:       admin / admin123')
    console.log('   Organizer:   organizer / organizer123')
    console.log('   Team Managers:')
    console.log('     - manager_it / manager123')
    console.log('     - manager_cs / manager123')
    console.log('     - manager_gis / manager123')
    console.log('     - manager_imm / manager123')
    console.log('   Viewers:')
    console.log('     - viewer1 / viewer123')
    console.log('     - viewer2 / viewer123')
    console.log('   ─────────────────────────────────')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
