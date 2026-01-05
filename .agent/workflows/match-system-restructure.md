# 🏆 แผนปรับปรุงโครงสร้างระบบกีฬาสี - Match-Based System

## 📋 สรุปการเปลี่ยนแปลง

ปรับจาก **Event-based** (1 Event = 1 ผลการแข่ง) เป็น **Match-based** (1 Sport = หลาย Matches)

### ตัวอย่างโครงสร้างใหม่:
```
กีฬา: ฟุตบอล
├── รอบแรก
│   ├── Match 1: IT vs CS (3-1)
│   ├── Match 2: GIS vs IMM (2-2, PK: 4-3)
├── รอบชิง
│   └── Match 3: IT vs GIS (2-0)
```

---

## 🗄️ Phase 1: ปรับ Database Schema

### 1.1 เพิ่ม Model ใหม่: `Match`
```prisma
model Match {
  id            String      @id @default(cuid())
  eventId       String      // FK to Event (กีฬาหลัก)
  roundName     String      // "รอบแรก", "รอบรอง", "รอบชิง"
  roundNumber   Int         // 1, 2, 3...
  matchNumber   Int         // Match ที่เท่าไรในรอบนั้น
  
  // ทีมที่แข่ง
  homeColorId   String      // สีเจ้าบ้าน
  awayColorId   String      // สีเยือน
  
  // คะแนน
  homeScore     Int?        // คะแนนเจ้าบ้าน
  awayScore     Int?        // คะแนนเยือน
  
  // สถานะ
  status        MatchStatus @default(SCHEDULED)
  scheduledAt   DateTime    // วันเวลาที่กำหนด
  startedAt     DateTime?   // เริ่มจริง
  endedAt       DateTime?   // จบจริง
  
  // Bracket position
  bracketPosition Int?      // ตำแหน่งใน bracket (1-8 สำหรับ 8 ทีม)
  nextMatchId   String?     // Match ถัดไปที่ผู้ชนะจะไป
  
  // Relations
  event         Event       @relation(fields: [eventId], references: [id])
  homeColor     Color       @relation("HomeTeam", fields: [homeColorId], references: [id])
  awayColor     Color       @relation("AwayTeam", fields: [awayColorId], references: [id])
  participants  MatchParticipant[]
  votes         Vote[]
  
  @@index([eventId, roundNumber])
  @@map("matches")
}

enum MatchStatus {
  SCHEDULED   // กำหนดแล้ว
  ONGOING     // กำลังแข่ง
  COMPLETED   // จบแล้ว
  CANCELLED   // ยกเลิก
}

model MatchParticipant {
  id          String   @id @default(cuid())
  matchId     String
  athleteId   String
  colorId     String
  position    String?  // ตำแหน่งในทีม (optional)
  
  match       Match    @relation(fields: [matchId], references: [id])
  athlete     Athlete  @relation(fields: [athleteId], references: [id])
  color       Color    @relation(fields: [colorId], references: [id])
  
  @@unique([matchId, athleteId])
  @@map("match_participants")
}
```

### 1.2 ปรับ Model `Event` (กีฬาหลัก)
```prisma
model Event {
  // ... existing fields ...
  
  // เพิ่ม Tournament settings
  tournamentType  TournamentType  @default(SINGLE_ELIMINATION)
  totalRounds     Int             @default(1)
  
  matches         Match[]
}

enum TournamentType {
  SINGLE_ELIMINATION  // แพ้คัดออก
  ROUND_ROBIN         // พบกันหมด
  GROUP_STAGE         // รอบแบ่งกลุ่ม
  SINGLE_MATCH        // แข่งครั้งเดียว (กรีฑา)
}
```

### 1.3 ปรับ Model `Vote`
```prisma
model Vote {
  // ... existing fields ...
  matchId     String?     // FK to Match (โหวตต่อแมช)
  
  match       Match?      @relation(fields: [matchId], references: [id])
}
```

---

## 🔌 Phase 2: ปรับ API Endpoints

### 2.1 API ใหม่
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/[id]/matches` | ดู matches ทั้งหมดของกีฬา |
| POST | `/api/events/[id]/matches` | สร้าง match ใหม่ |
| GET | `/api/matches/[id]` | ดูรายละเอียด match |
| PUT | `/api/matches/[id]` | อัพเดทผล match |
| GET | `/api/matches/[id]/participants` | นักกีฬาที่ลงแข่ง |
| POST | `/api/matches/[id]/participants` | เพิ่มนักกีฬาลงแข่ง |
| GET | `/api/events/[id]/bracket` | ดู tournament bracket |
| POST | `/api/matches/[id]/vote` | โหวตนักกีฬาในแมช |

### 2.2 ปรับ API เดิม
| Endpoint | Changes |
|----------|---------|
| `/api/events` | Include matches count |
| `/api/events/[id]` | Include matches with results |
| `/api/leaderboard` | Include breakdown by sport/match |

---

## 🖥️ Phase 3: ปรับ Frontend Pages

### 3.1 Public Pages (ผู้ชม)

#### `/schedule` - ตารางแข่งขัน
- **เดิม**: แสดง events ทั้งหมด
- **ใหม่**: 
  - แยก tab ตามกีฬา (ฟุตบอล, บาสเกตบอล, ...)
  - แสดง bracket diagram
  - แสดง matches พร้อมเวลา
  - คลิกดู match detail

#### `/results` - ผลการแข่งขัน
- **เดิม**: แสดง events ที่จบ
- **ใหม่**:
  - แสดง matches ที่จบ
  - แต่ละ card แสดง: กีฬา, รอบ, IT 3-1 CS
  - Filter ตามกีฬา, รอบ

#### `/results/[matchId]` - รายละเอียดแมช
- **เดิม**: แสดง ranking 1,2,3,4
- **ใหม่**:
  - แสดง IT 5-0 CS แบบ scoreboard
  - รายชื่อนักกีฬาที่ลง (แยกตามสี)
  - ปุ่มโหวต MVP ของแมช
  - ผลโหวตแบบ real-time

#### `/leaderboard` - คะแนนรวม
- **เดิม**: แสดงคะแนนรวมของแต่ละสี
- **ใหม่**:
  - แสดงคะแนนรวม + breakdown
  - ตาราง: แต่ละกีฬาใครได้อันดับเท่าไร
  - กดดู detail ของแต่ละกีฬา

### 3.2 Organizer Pages

#### `/organizer/events/[id]` - จัดการกีฬา
- เพิ่ม: Bracket management
- เพิ่ม: สร้าง/แก้ไข matches
- เพิ่ม: กำหนดนักกีฬาลงแต่ละ match

#### `/organizer/events/[id]/matches/[matchId]` - บันทึกผลแมช
- ใส่คะแนน home/away
- เลือกนักกีฬาที่ลงแข่ง
- บันทึกผล

#### `/organizer/voting` - จัดการโหวต
- เปิด/ปิดโหวตต่อ match
- ดูสถิติโหวตแต่ละ match

### 3.3 Team Manager Pages

#### `/team-manager/register/[eventId]` - ลงทะเบียน
- ปรับให้ลงทะเบียนต่อ match (ถ้าจำเป็น)
- หรือลงทะเบียนภาพรวมแล้ว organizer จัดลง match

#### `/team-manager/results` - ดูผลทีม
- แสดง matches ที่ทีมเข้าแข่ง
- สถิติ ชนะ/แพ้/เสมอ

### 3.4 Admin Pages
- ไม่มีการเปลี่ยนแปลงมาก
- เพิ่มการจัดการ tournament types

---

## 🎨 Phase 4: UI Components ใหม่

### 4.1 TournamentBracket
- แสดง bracket diagram (single elimination)
- แสดง matches แต่ละรอบ
- Highlight match ที่กำลังแข่ง/จบแล้ว

### 4.2 MatchScoreCard
- แสดง: สีA [คะแนน] - [คะแนน] สีB
- Badge: รอบ, สถานะ
- ปุ่ม: ดูรายละเอียด

### 4.3 MatchDetailView
- Scoreboard ขนาดใหญ่
- รายชื่อนักกีฬาแยกตามสี
- ส่วนโหวต MVP
- ผลโหวต chart

### 4.4 SportScheduleTab
- Tabs: ฟุตบอล | บาสเกตบอล | ...
- แต่ละ tab แสดง bracket/schedule ของกีฬานั้น

---

## 🌱 Phase 5: Seed Data

### 5.1 สร้าง Matches ตัวอย่าง
```typescript
// ฟุตบอล (Single Elimination - 4 ทีม)
// รอบรองชนะเลิศ
Match 1: IT vs CS (รอบรอง)
Match 2: GIS vs IMM (รอบรอง)
// รอบชิง
Match 3: ผู้ชนะ Match1 vs ผู้ชนะ Match2

// บาสเกตบอล
Match 1: IT vs GIS
Match 2: CS vs IMM
Match 3: Final
```

---

## ✅ Checklist การปรับปรุง

### Schema
- [ ] เพิ่ม Match model
- [ ] เพิ่ม MatchParticipant model
- [ ] เพิ่ม MatchStatus enum
- [ ] เพิ่ม TournamentType enum
- [ ] ปรับ Event model
- [ ] ปรับ Vote model
- [ ] Run migration

### API
- [ ] POST/GET `/api/events/[id]/matches`
- [ ] GET/PUT `/api/matches/[id]`
- [ ] GET/POST `/api/matches/[id]/participants`
- [ ] GET `/api/events/[id]/bracket`
- [ ] POST `/api/matches/[id]/vote`
- [ ] ปรับ `/api/leaderboard`

### Frontend - Public
- [ ] `/schedule` - Add sport tabs + bracket
- [ ] `/results` - Show match results
- [ ] `/results/[matchId]` - Match detail + vote
- [ ] `/leaderboard` - Add sport breakdown

### Frontend - Organizer
- [ ] `/organizer/events/[id]` - Bracket management
- [ ] `/organizer/events/[id]/matches/[matchId]` - Record match result

### Frontend - Team Manager
- [ ] `/team-manager/register` - Adjust if needed
- [ ] `/team-manager/results` - Show match results

### Components
- [ ] TournamentBracket
- [ ] MatchScoreCard
- [ ] MatchDetailView
- [ ] SportScheduleTab

### Seed Data
- [ ] Create sample matches
- [ ] Create match participants
- [ ] Create sample votes per match

---

## 🚀 ลำดับการทำงาน

1. **อัพเดท Schema** → `prisma db push`
2. **สร้าง API ใหม่** → matches, participants, bracket
3. **สร้าง Components** → bracket, score card
4. **ปรับ Frontend** → schedule, results, leaderboard
5. **อัพเดท Seed** → สร้างข้อมูลตัวอย่าง
6. **ทดสอบ** → ทุก role ทำงานได้ถูกต้อง

---

*Created: 2026-01-05*
*Status: In Progress*
