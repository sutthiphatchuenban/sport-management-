# 🏆 ระบบจัดการกีฬาสี
## พร้อมระบบโหวตนักกีฬายอดเยี่ยม

---

# 📑 สารบัญ

1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [ผู้ใช้งานและสิทธิ์](#ผู้ใช้งานและสิทธิ์)
3. [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
4. [รายการหน้าจอทั้งหมด](#รายการหน้าจอทั้งหมด)
5. [API Endpoints+api-spec](#api-endpoints+api-spec)
6. [Workflow ทั้งหมด](#workflow-ทั้งหมด)
7. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
8. [โครงสร้างไฟล์](#โครงสร้างไฟล์)

---

# 🎯 ภาพรวมระบบ

## วัตถุประสงค์
ระบบจัดการการแข่งขันกีฬาสีระดับมหาวิทยาลัย รองรับ:
- การจัดการการแข่งขันและบันทึกผล
- แสดงคะแนนแบบ Real-time
- ลงทะเบียนนักกีฬา
- **โหวตนักกีฬายอดเยี่ยมในแต่ละแมชต์**
- สะสมคะแนนโหวตเพื่อรับรางวัลตอนปิดงาน

## ผู้ใช้งาน 4 กลุ่ม
1. **Admin (ผู้ดูแลระบบ)** - จัดการระบบทั้งหมด
2. **Organizer (สโมสรนิสิต)** - ผู้จัดงาน บันทึกผล จัดการโหวต
3. **Team Manager (ตัวแทนสาขา)** - ลงทะเบียนนักกีฬา ดูสถิติทีม
4. **Viewer (ผู้ชม)** - ดูผลการแข่งขัน โหวตนักกีฬา

---

# 👥 ผู้ใช้งานและสิทธิ์

## 1. Admin (ผู้ดูแลระบบ) ⚙️

### สิทธิ์การใช้งาน
- ✅ จัดการผู้ใช้งานทุก Role
- ✅ จัดการข้อมูลพื้นฐาน (สาขา, สี, ประเภทกีฬา)
- ✅ ตั้งค่าระบบโหวต
- ✅ จัดการรางวัล
- ✅ ดูรายงานและสถิติทั้งหมด
- ✅ Backup/Restore ข้อมูล
- ✅ ดู Activity Logs

### ฟีเจอร์เด่น
- Dashboard ภาพรวมทั้งหมด
- จัดการผู้ใช้: สร้าง/แก้ไข/ลบ/ล็อค
- ตั้งค่าประเภทกีฬา
- กำหนดเกณฑ์การให้คะแนน
- จัดการประเภทรางวัล

---

## 2. Organizer (สโมสรนิสิต) 🎪

### สิทธิ์การใช้งาน
- ✅ สร้าง/แก้ไข/ลบรายการแข่งขัน
- ✅ บันทึกผลการแข่งขัน
- ✅ เปิด/ปิดระบบโหวต
- ✅ ดูสถิติการโหวตแบบ Real-time
- ✅ จัดการตารางการแข่งขัน
- ✅ ประกาศรางวัล
- ✅ Export รายงาน

### ฟีเจอร์เด่น
- Dashboard: Leaderboard คะแนนรวม
- จัดการการแข่งขัน: สร้าง/กำหนดเวลา/สถานที่
- บันทึกผลการแข่งขัน: กรอกอันดับ → คำนวณคะแนนอัตโนมัติ
- ตารางการแข่งขัน: Calendar View
- ระบบโหวต: เปิด/ปิด/ดูสถิติ
- ประกาศรางวัล: เลือกผู้ชนะ MVP

---

## 3. Team Manager (ตัวแทนสาขา) 👔

### สิทธิ์การใช้งาน
- ✅ ลงทะเบียนนักกีฬาในสีของตัวเอง
- ✅ แก้ไข/ลบข้อมูลนักกีฬา
- ✅ ลงทะเบียนนักกีฬาเข้าแข่งขันแต่ละรายการ
- ✅ ดูผลการแข่งขันของสีตัวเอง
- ✅ ดูสถิติการโหวตของนักกีฬาในทีม

### ฟีเจอร์เด่น
- Dashboard: คะแนนของสีตัวเอง
- จัดการนักกีฬา: เพิ่ม/แก้ไข/ดูรายชื่อ
- ลงทะเบียนเข้าแข่งขัน: เลือกรายการ → เลือกนักกีฬา
- ดูผลการแข่งขัน: ของสีตัวเอง
- สถิติการโหวต: นักกีฬาในทีมได้รับโหวตเท่าไร

---

## 4. Viewer (ผู้ชม) 👀

### สิทธิ์การใช้งาน
- ✅ ดูผลการแข่งขันแบบ Real-time
- ✅ ดูคะแนนรวมแต่ละสี (Leaderboard)
- ✅ ดูตารางการแข่งขัน
- ✅ **โหวตนักกีฬายอดเยี่ยม (1 โหวต/แมชต์)**
- ✅ ดูผลโหวตแบบ Real-time
- ✅ ดูรายชื่อนักกีฬา

### ฟีเจอร์เด่น
- Leaderboard: คะแนนรวมแบบ Real-time (auto-refresh)
- ผลการแข่งขัน: ดูผลแต่ละรายการ
- ตารางการแข่งขัน: วัน/เวลา/สถานที่
- **โหวตนักกีฬา: เลือกนักกีฬา → ยืนยัน → บันทึก**
- ผลโหวต: ดู Top 3 แต่ละแมชต์
- รายชื่อนักกีฬา: กรองตามสี/สาขา

---

# 🗄️ โครงสร้างฐานข้อมูล

## ตารางทั้งหมด (16 ตาราง)

### 1. users (ผู้ใช้งาน)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin','organizer','team_manager','viewer') NOT NULL,
  major_id INT, -- FK to majors (สำหรับ team_manager)
  color_id INT, -- FK to colors (สำหรับ team_manager)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. majors (สาขาวิชา)
```sql
CREATE TABLE majors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL, -- เทคโนโลยีสารสนเทศ
  code VARCHAR(10) NOT NULL, -- IT
  color_id INT, -- FK to colors
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. colors (สีทีม)
```sql
CREATE TABLE colors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL, -- แดง, เหลือง, เขียว, น้ำเงิน
  hex_code VARCHAR(7) NOT NULL, -- #FF0000
  total_score INT DEFAULT 0, -- คะแนนรวม (คำนวณจาก event_results)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. sport_types (ประเภทกีฬา)
```sql
CREATE TABLE sport_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL, -- วิ่ง 100 เมตร, ฟุตบอล
  category ENUM('individual','team') NOT NULL, -- บุคคล/ทีม
  max_participants INT, -- จำนวนนักกีฬาสูงสุดต่อทีม
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. events (รายการแข่งขัน)
```sql
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sport_type_id INT NOT NULL, -- FK to sport_types
  name VARCHAR(200) NOT NULL, -- ฟุตบอล ชาย รอบชิงชนะเลิศ
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(200), -- สนามฟุตบอล A
  status ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  created_by INT, -- FK to users (organizer)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6. scoring_rules (เกณฑ์การให้คะแนน)
```sql
CREATE TABLE scoring_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT, -- FK to events (null = กฎทั่วไป)
  rank INT NOT NULL, -- อันดับที่ 1, 2, 3...
  points INT NOT NULL, -- คะแนนที่ได้
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. athletes (นักกีฬา)
```sql
CREATE TABLE athletes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(20) UNIQUE NOT NULL, -- รหัสนิสิต
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  major_id INT NOT NULL, -- FK to majors
  color_id INT NOT NULL, -- FK to colors
  photo_url VARCHAR(255),
  registered_by INT, -- FK to users (team_manager)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8. event_registrations (การลงทะเบียนเข้าแข่งขัน)
```sql
CREATE TABLE event_registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL, -- FK to events
  athlete_id INT NOT NULL, -- FK to athletes
  color_id INT NOT NULL, -- FK to colors
  status ENUM('registered','confirmed','disqualified') DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_registration (event_id, athlete_id)
);
```

### 9. event_results (ผลการแข่งขัน)
```sql
CREATE TABLE event_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL, -- FK to events
  color_id INT NOT NULL, -- FK to colors
  athlete_id INT, -- FK to athletes (สำหรับกีฬาบุคคล)
  rank INT NOT NULL, -- อันดับที่ได้
  points INT NOT NULL, -- คะแนนที่ได้
  notes TEXT, -- หมายเหตุ
  recorded_by INT, -- FK to users (organizer)
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 10. announcements (ประกาศ)
```sql
CREATE TABLE announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('general','urgent','result') DEFAULT 'general',
  created_by INT, -- FK to users
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. activity_logs (ประวัติการใช้งาน)
```sql
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT, -- FK to users
  action ENUM('create','update','delete','login','logout'),
  table_name VARCHAR(50),
  record_id INT,
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 12. vote_settings (การตั้งค่าโหวต) 🆕
```sql
CREATE TABLE vote_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT, -- FK to events (null = ตั้งค่าทั่วไป)
  voting_enabled BOOLEAN DEFAULT TRUE,
  voting_start DATETIME,
  voting_end DATETIME,
  max_votes_per_user INT DEFAULT 1, -- โหวตได้กี่ครั้งต่อคน
  show_realtime_results BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 13. votes (การโหวต) 🆕
```sql
CREATE TABLE votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL, -- FK to events
  athlete_id INT NOT NULL, -- FK to athletes
  voter_ip VARCHAR(45), -- IP ของผู้โหวต
  voter_user_id INT, -- FK to users (ถ้าล็อกอิน)
  voter_device_id VARCHAR(255), -- Device Fingerprint
  vote_reason TEXT, -- เหตุผลที่โหวต (optional)
  is_valid BOOLEAN DEFAULT TRUE, -- ใช้กรองโหวตซ้ำ/Spam
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_athlete (event_id, athlete_id),
  INDEX idx_event_ip (event_id, voter_ip),
  INDEX idx_event_device (event_id, voter_device_id)
);
```

### 14. athlete_vote_summary (สรุปคะแนนโหวต) 🆕
```sql
CREATE TABLE athlete_vote_summary (
  id INT PRIMARY KEY AUTO_INCREMENT,
  athlete_id INT NOT NULL, -- FK to athletes
  event_id INT, -- FK to events (null = คะแนนรวมทั้งหมด)
  total_votes INT DEFAULT 0,
  rank INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_summary (athlete_id, event_id)
);
```

### 15. awards (รางวัล) 🆕
```sql
CREATE TABLE awards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL, -- นักกีฬายอดเยี่ยม, MVP ฟุตบอล
  description TEXT,
  award_type ENUM('overall','category','special') NOT NULL,
  category VARCHAR(100), -- ประเภทกีฬา (ถ้าเป็น category award)
  criteria JSON, -- เกณฑ์การให้รางวัล
  prize_details TEXT,
  image_url VARCHAR(255),
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 16. award_winners (ผู้ได้รับรางวัล) 🆕
```sql
CREATE TABLE award_winners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  award_id INT NOT NULL, -- FK to awards
  athlete_id INT NOT NULL, -- FK to athletes
  votes_received INT,
  score FLOAT, -- คะแนนรวม
  rank INT,
  announced_at TIMESTAMP,
  claimed BOOLEAN DEFAULT FALSE, -- รับรางวัลแล้วหรือยัง
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 📄 รายการหน้าจอทั้งหมด

## 🔐 หน้าทั่วไป (Public Pages)

### P1. หน้า Landing Page
- **URL**: `/`
- **ผู้เข้าถึง**: ทุกคน
- **รายละเอียด**:
  - Banner งานกีฬาสี
  - คะแนนรวมแต่ละสี (แบบ Real-time)
  - ปุ่ม Login
  - ลิงก์ไปหน้าผลการแข่งขัน
  - ลิงก์ไปหน้าตารางการแข่งขัน

### P2. หน้า Login
- **URL**: `/login`
- **ผู้เข้าถึง**: ทุกคน
- **ฟอร์ม**:
  - Username
  - Password
  - ปุ่ม Login
  - ลิงก์ Forgot Password

### P3. หน้า Register (สำหรับ Viewer)
- **URL**: `/register`
- **ผู้เข้าถึง**: ทุกคน
- **ฟอร์ม**:
  - Email
  - Username
  - Password
  - Confirm Password
  - ปุ่ม Register

### P4. หน้า Forgot Password
- **URL**: `/forgot-password`
- **ผู้เข้าถึง**: ทุกคน
- **ฟอร์ม**:
  - Email
  - ปุ่ม Send Reset Link

---

## 👤 หน้า Admin (10 หน้า)

### A1. Admin Dashboard
- **URL**: `/admin/dashboard`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - สถิติผู้ใช้งาน (จำนวนแต่ละ Role)
  - จำนวนการแข่งขันทั้งหมด
  - จำนวนนักกีฬาทั้งหมด
  - จำนวนโหวตทั้งหมด
  - กราฟคะแนนแต่ละสี
  - Activity Logs ล่าสุด (10 รายการ)
  - Quick Actions: สร้างผู้ใช้, ตั้งค่าระบบ

### A2. จัดการผู้ใช้ - รายการ
- **URL**: `/admin/users`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - ตารางแสดงรายชื่อผู้ใช้
  - คอลัมน์: ID, Username, Email, Role, Status, Created Date
  - ค้นหา: ตาม Username/Email
  - กรอง: ตาม Role, Status (Active/Inactive)
  - Actions: View, Edit, Delete, Lock/Unlock
  - ปุ่ม + เพิ่มผู้ใช้ใหม่

### A3. จัดการผู้ใช้ - เพิ่ม/แก้ไข
- **URL**: `/admin/users/new` หรือ `/admin/users/edit/:id`
- **ผู้เข้าถึง**: Admin
- **ฟอร์ม**:
  - Username
  - Email
  - Password (สำหรับเพิ่มใหม่)
  - Role: Admin/Organizer/Team Manager/Viewer
  - สาขา (ถ้าเป็น Team Manager)
  - สี (ถ้าเป็น Team Manager)
  - Status: Active/Inactive
  - ปุ่ม Save/Cancel

### A4. จัดการสาขา
- **URL**: `/admin/majors`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - ตารางแสดงสาขาทั้งหมด
  - คอลัมน์: ID, ชื่อสาขา, รหัสสาขา, สี
  - Actions: Edit, Delete
  - ปุ่ม + เพิ่มสาขา
- **Modal เพิ่ม/แก้ไขสาขา**:
  - ชื่อสาขา
  - รหัสสาขา
  - เลือกสี

### A5. จัดการสี
- **URL**: `/admin/colors`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - การ์ดแสดงสีทั้งหมด (แดง, เหลือง, เขียว, น้ำเงิน)
  - แสดงคะแนนรวมแต่ละสี
  - Actions: Edit
  - ปุ่ม + เพิ่มสี
- **Modal แก้ไขสี**:
  - ชื่อสี
  - Hex Code (Color Picker)

### A6. จัดการประเภทกีฬา
- **URL**: `/admin/sport-types`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - ตารางแสดงประเภทกีฬา
  - คอลัมน์: ID, ชื่อ, ประเภท (บุคคล/ทีม), จำนวนนักกีฬาสูงสุด
  - Actions: Edit, Delete
  - ปุ่ม + เพิ่มประเภทกีฬา
- **Modal เพิ่ม/แก้ไข**:
  - ชื่อประเภทกีฬา
  - ประเภท: Individual/Team
  - จำนวนนักกีฬาสูงสุดต่อทีม
  - คำอธิบาย

### A7. ตั้งค่าเกณฑ์คะแนน
- **URL**: `/admin/scoring-rules`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - ตารางเกณฑ์คะแนนทั่วไป
  - คอลัมน์: อันดับ (1, 2, 3...), คะแนน
  - Actions: Edit
  - ปุ่ม Save Changes
- **ฟอร์ม**:
  - อันดับที่ 1: [__] คะแนน
  - อันดับที่ 2: [__] คะแนน
  - อันดับที่ 3: [__] คะแนน
  - ... (ตามต้องการ)

### A8. จัดการรางวัล 🆕
- **URL**: `/admin/awards`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - ตารางแสดงรางวัลทั้งหมด
  - คอลัมน์: ชื่อรางวัล, ประเภท, คำอธิบาย, Actions
  - ปุ่ม + เพิ่มรางวัล
- **Modal เพิ่ม/แก้ไขรางวัล**:
  - ชื่อรางวัล
  - ประเภท: Overall MVP/Category MVP/Special
  - ประเภทกีฬา (ถ้าเป็น Category)
  - คำอธิบาย
  - รายละเอียดของรางวัล
  - อัพโหลดรูปภาพ

### A9. Activity Logs
- **URL**: `/admin/logs`
- **ผู้เข้าถึง**: Admin
- **เนื้อหา**:
  - ตารางแสดง Activity Logs
  - คอลัมน์: วันที่/เวลา, ผู้ใช้, Action, ตาราง, รายละเอียด, IP
  - กรอง: ตามวันที่, ผู้ใช้, Action
  - ค้นหา: ตาม User/IP
  - Export to CSV

### A10. ตั้งค่าระบบโหวต (ทั่วไป) 🆕
- **URL**: `/admin/vote-settings`
- **ผู้เข้าถึง**: Admin
- **ฟอร์ม**:
  - เปิดระบบโหวต: Yes/No
  - จำนวนโหวตสูงสุดต่อคน
  - แสดงผลโหวต Real-time: Yes/No
  - ป้องกันโหวตซ้ำ: IP/Device/Login
  - เปิด CAPTCHA: Yes/No
  - ปุ่ม Save Settings

---

## 🎪 หน้า Organizer (สโมสรนิสิต) (12 หน้า)

### O1. Organizer Dashboard
- **URL**: `/organizer/dashboard`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - **Leaderboard คะแนนรวม** (แสดงแบบ Big Display)
  - รายการแข่งขันวันนี้
  - รายการแข่งขันที่รอบันทึกผล
  - สถิติการโหวตวันนี้
  - Quick Actions: สร้างการแข่งขัน, บันทึกผล, เปิดโหวต

### O2. จัดการการแข่งขัน - รายการ
- **URL**: `/organizer/events`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - ตารางแสดงรายการแข่งขันทั้งหมด
  - คอลัมน์: ชื่อ, ประเภทกีฬา, วันที่, เวลา, สถานที่, สถานะ
  - กรอง: ตามสถานะ (Upcoming/Ongoing/Completed)
  - ค้นหา: ตามชื่อ
  - Actions: View, Edit, Delete, บันทึกผล
  - ปุ่ม + สร้างการแข่งขันใหม่

### O3. จัดการการแข่งขัน - เพิ่ม/แก้ไข
- **URL**: `/organizer/events/new` หรือ `/organizer/events/edit/:id`
- **ผู้เข้าถึง**: Organizer
- **ฟอร์ม**:
  - ชื่อการแข่งขัน
  - เลือกประเภทกีฬา
  - วันที่
  - เวลา
  - สถานที่
  - คำอธิบาย
  - เกณฑ์คะแนน (ใช้ค่าเริ่มต้นหรือกำหนดเอง)
  - สถานะ: Upcoming/Ongoing/Completed/Cancelled
  - ปุ่ม Save/Cancel

### O4. รายละเอียดการแข่งขัน
- **URL**: `/organizer/events/:id`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - ข้อมูลการแข่งขัน (ชื่อ, วันที่, เวลา, สถานที่)
  - รายชื่อนักกีฬาที่ลงแข่งขัน (แยกตามสี)
  - สถิติการลงทะเบียน
  - ผลการแข่งขัน (ถ้ามี)
  - สถิติการโหวต (ถ้าเปิด)
  - ปุ่ม: แก้ไข, บันทึกผล, เปิดโหวต, ดูผลโหวต

### O5. บันทึกผลการแข่งขัน
- **URL**: `/organizer/events/:id/record`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - ชื่อการแข่งขัน
  - รายชื่อสี/นักกีฬาที่เข้าแข่งขัน
  - **ฟอร์มบันทึกผล**:
    - เลือกอันดับที่ 1: [Dropdown เลือกสี]
    - เลือกอันดับที่ 2: [Dropdown เลือกสี]
    - เลือกอันดับที่ 3: [Dropdown เลือกสี]
    - ... (ตามจำนวนสี/ทีม)
  - แสดงคะแนนที่จะได้ (Auto-calculate)
  - หมายเหตุ
  - ปุ่ม: ยืนยันผล, ยกเลิก
- **Confirm Dialog**: ยืนยันการบันทึกผล (ไม่สามารถแก้ไขได้)

### O6. แก้ไขผลการแข่งขัน
- **URL**: `/organizer/events/:id/edit-result`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - แสดงผลการแข่งขันเดิม
  - ฟอร์มแก้ไขผล (เหมือน O5)
  - **บังคับกรอกเหตุผล**: ทำไมต้องแก้ไข
  - ปุ่ม: ยืนยันการแก้ไข, ยกเลิก
- **Alert**: การแก้ไขจะถูกบันทึกใน Activity Logs

### O7. ตารางการแข่งขัน
- **URL**: `/organizer/schedule`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - มุมมองแบบ Calendar (Month/Week/Day View)
  - แสดงรายการแข่งขันแต่ละวัน
  - กรอง: ตามประเภทกีฬา, สถานะ
  - สี: แยกตามสถานะ (Upcoming=สีเขียว, Ongoing=สีเหลือง, Completed=สีเทา)
  - คลิกดู: รายละเอียดการแข่งขัน
  - ปุ่ม: Export to PDF, พิมพ์

### O8. จัดการระบบโหวต - รายการ 🆕
- **URL**: `/organizer/voting`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - ตารางแสดงการแข่งขันทั้งหมด
  - คอลัมน์: ชื่อ, วันที่, สถานะโหวต (เปิด/ปิด), จำนวนโหวต
  - Actions: เปิดโหวต, ปิดโหวต, ดูสถิติ
  - กรอง: ตามสถานะโหวต
  - สรุป: จำนวนโหวตทั้งหมดวันนี้

### O9. ตั้งค่าโหวตสำหรับแมชต์ 🆕
- **URL**: `/organizer/voting/:event_id/settings`
- **ผู้เข้าถึง**: Organizer
- **ฟอร์ม**:
  - ชื่อการแข่งขัน (แสดงอย่างเดียว)
  - เปิดการโหวต: Yes/No (Toggle)
  - วันที่เริ่มโหวต
  - เวลาเริ่มโหวต
  - วันที่สิ้นสุดโหวต
  - เวลาสิ้นสุดโหวต
  - แสดงผลโหวต Real-time: Yes/No
  - ปุ่ม: บันทึก, ยกเลิก

### O10. สถิติการโหวต - แบบ Real-time 🆕
- **URL**: `/organizer/voting/:event_id/stats`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - ชื่อการแข่งขัน
  - สถานะโหวต: เปิด/ปิด
  - จำนวนโหวตทั้งหมด
  - **Leaderboard (Top 10)**:
    - อันดับ, รูปนักกีฬา, ชื่อ, สี, จำนวนโหวต
    - แสดงแบบ Bar Chart
  - **กราฟการโหวตตามเวลา** (Line Chart)
  - ตาราง: รายละเอียดทุกนักกีฬา
  - Auto-refresh ทุก 5 วินาที
  - ปุ่ม: Export CSV, ปิดโหวต

### O11. ประกาศรางวัล 🆕
- **URL**: `/organizer/awards/announce`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - รายการรางวัลทั้งหมด
  - **MVP รวม (Overall)**:
    - Top 10 นักกีฬา (เรียงตามโหวต)
    - เลือกอันดับ 1, 2, 3
  - **MVP แต่ละประเภท**:
    - เลือกประเภทกีฬา
    - Top 10 ของประเภทนั้น
    - เลือกผู้ชนะ
  - **รางวัลพิเศษ**:
    - เลือกนักกีฬาด้วยตนเอง
  - ปุ่ม: ประกาศรางวัล (บันทึกลง award_winners)

### O12. รายงานและสถิติ
- **URL**: `/organizer/reports`
- **ผู้เข้าถึง**: Organizer
- **เนื้อหา**:
  - สรุปคะแนนรวมแต่ละสี (กราฟ)
  - สถิติการแข่งขันแต่ละประเภท
  - สถิติการโหวต
  - รายชื่อนักกีฬายอดเยี่ยม Top 20
  - Export: PDF, CSV, Excel

---

## 👔 หน้า Team Manager (ตัวแทนสาขา) (8 หน้า)

### T1. Team Manager Dashboard
- **URL**: `/team-manager/dashboard`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - คะแนนรวมของสีตัวเอง (แบบ Big Display)
  - อันดับคะแนนรวม (ของสีตัวเอง)
  - จำนวนนักกีฬาในทีม
  - รายการแข่งขันที่ต้องส่งนักกีฬา
  - สถิติการโหวตของนักกีฬาในทีม
  - Quick Actions: ลงทะเบียนนักกีฬา, ลงทะเบียนเข้าแข่งขัน

### T2. จัดการนักกีฬา - รายการ
- **URL**: `/team-manager/athletes`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - ตารางแสดงนักกีฬาในทีม
  - คอลัมน์: รูป, รหัสนิสิต, ชื่อ-สกุล, สาขา, คะแนนโหวต
  - ค้นหา: ตามชื่อ/รหัสนิสิต
  - กรอง: ตามสาขา
  - Actions: View, Edit, Delete
  - ปุ่ม + ลงทะเบียนนักกีฬาใหม่

### T3. จัดการนักกีฬา - เพิ่ม/แก้ไข
- **URL**: `/team-manager/athletes/new` หรือ `/team-manager/athletes/edit/:id`
- **ผู้เข้าถึง**: Team Manager
- **ฟอร์ม**:
  - รหัสนิสิต (ตรวจสอบไม่ซ้ำ)
  - ชื่อ
  - นามสกุล
  - สาขา (Auto-fill ตามสีที่ Team Manager ดูแล)
  - สี (Auto-fill)
  - อัพโหลดรูปถ่าย
  - ปุ่ม Save/Cancel

### T4. รายละเอียดนักกีฬา
- **URL**: `/team-manager/athletes/:id`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - รูปโปรไฟล์
  - ข้อมูลนักกีฬา (ชื่อ, รหัส, สาขา, สี)
  - **สถิติ**:
    - คะแนนการแข่งขันรวม
    - จำนวนโหวตที่ได้รับ
    - อันดับในสี/ทั้งหมด
  - **รายการแข่งขันที่เข้าร่วม**:
    - ชื่อ, วันที่, อันดับ, คะแนน
  - **สถิติการโหวต**:
    - จำนวนโหวตแต่ละแมชต์
  - ปุ่ม: แก้ไข, ลบ

### T5. ลงทะเบียนเข้าแข่งขัน - เลือกรายการ
- **URL**: `/team-manager/register`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - รายการแข่งขันที่เปิดรับสมัคร
  - การ์ดแสดงแต่ละการแข่งขัน:
    - ชื่อ, วันที่, เวลา, สถานที่
    - สถานะ: เปิดรับสมัคร/ปิดรับสมัคร
    - จำนวนนักกีฬาที่ลงแล้ว/สูงสุด
    - ปุ่ม: ลงทะเบียน
  - กรอง: ตามประเภทกีฬา, วันที่

### T6. ลงทะเบียนเข้าแข่งขัน - เลือกนักกีฬา
- **URL**: `/team-manager/register/:event_id`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - ข้อมูลการแข่งขัน
  - **เลือกนักกีฬา**:
    - รายชื่อนักกีฬาในทีม (Checkbox)
    - กรอง: ตามสาขา
    - ค้นหา: ตามชื่อ
    - จำกัดจำนวน: ตาม max_participants
  - นักกีฬาที่เลือกแล้ว (แสดงด้านข้าง)
  - ปุ่ม: ยืนยันการลงทะเบียน, ยกเลิก
- **Confirm Dialog**: ยืนยันรายชื่อนักกีฬา

### T7. ดูผลการแข่งขัน
- **URL**: `/team-manager/results`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - **ผลของสีตัวเอง**:
    - ตารางแสดงผลแต่ละรายการ
    - คอลัมน์: การแข่งขัน, วันที่, อันดับ, คะแนนที่ได้
  - **เปรียบเทียบกับสีอื่น**:
    - กราฟเปรียบเทียบคะแนน
  - กรอง: ตามประเภทกีฬา, วันที่
  - Export: PDF, CSV

### T8. สถิติการโหวต 🆕
- **URL**: `/team-manager/voting-stats`
- **ผู้เข้าถึง**: Team Manager
- **เนื้อหา**:
  - **TOP 10 นักกีฬาในทีม** (ตามโหวต)
  - ตาราง:
    - อันดับ, รูป, ชื่อ, จำนวนโหวต, อันดับรวม
  - **สถิติการโหวตแต่ละแมชต์**:
    - การแข่งขัน, นักกีฬา, โหวต, อันดับ
  - กราฟ: แนวโน้มการโหวต
  - Export: CSV

---

## 👀 หน้า Viewer (ผู้ชม) (9 หน้า)

### V1. หน้าหลัก - Leaderboard
- **URL**: `/viewer/leaderboard`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - **คะแนนรวมแต่ละสี** (แบบ Real-time):
    - แสดงเป็น Big Cards
    - ชื่อสี + คะแนนรวม
    - กราฟแท่งแสดงสัดส่วน
  - Auto-refresh ทุก 5 วินาที
  - Animation เมื่อคะแนนเปลี่ยน
  - Responsive: มือถือ/Tablet/Desktop/TV

### V2. ผลการแข่งขัน - รายการทั้งหมด
- **URL**: `/viewer/results`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - รายการแข่งขันที่จบแล้ว
  - การ์ดแสดงแต่ละรายการ:
    - ชื่อ, วันที่, เวลา
    - ปุ่ม: ดูผล
  - กรอง: ตามประเภทกีฬา, วันที่
  - ค้นหา: ตามชื่อ

### V3. ผลการแข่งขัน - รายละเอียด
- **URL**: `/viewer/results/:event_id`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - ข้อมูลการแข่งขัน
  - **ผลการแข่งขัน**:
    - อันดับที่ 1, 2, 3... (แสดงแบบ Podium)
    - ชื่อสี, นักกีฬา, คะแนน
  - **ผลโหวต** (ถ้าเปิด):
    - Top 3 นักกีฬายอดเยี่ยม
  - Share: Facebook, Twitter, Line

### V4. ตารางการแข่งขัน
- **URL**: `/viewer/schedule`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - มุมมองแบบ Calendar (Month/Week/Day)
  - การ์ดแสดงการแข่งขันแต่ละวัน
  - ข้อมูล: ชื่อ, เวลา, สถานที่, สถานะ
  - กรอง: ตามประเภทกีฬา
  - คลิก: ดูรายละเอียด
  - ปุ่ม: Add to Calendar (Google/iCal)

### V5. รายชื่อนักกีฬา
- **URL**: `/viewer/athletes`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - การ์ดแสดงนักกีฬาทั้งหมด
  - แสดง: รูป, ชื่อ, สาขา, สี
  - กรอง: ตามสี, สาขา
  - ค้นหา: ตามชื่อ/รหัสนิสิต
  - คลิก: ดูโปรไฟล์

### V6. โปรไฟล์นักกีฬา
- **URL**: `/viewer/athletes/:id`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - รูปโปรไฟล์
  - ข้อมูล: ชื่อ, รหัส, สาขา, สี
  - **สถิติ**:
    - คะแนนการแข่งขันรวม
    - จำนวนโหวตรวม
    - อันดับ
  - **รายการแข่งขันที่เข้าร่วม**
  - **สถิติการโหวต**
  - ปุ่ม: โหวต (ถ้าเปิด)

### V7. โหวตนักกีฬายอดเยี่ยม 🆕
- **URL**: `/viewer/vote/:event_id`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - ชื่อการแข่งขัน
  - เวลาที่เหลือ (Countdown Timer)
  - **รายชื่อนักกีฬาที่ลงแข่งขัน** (แยกตามสี):
    - รูป, ชื่อ, สาขา
    - จำนวนโหวตปัจจุบัน (ถ้าแสดง Real-time)
    - ปุ่ม: โหวต
  - สถานะ: คุณโหวตแล้ว (ถ้าโหวตแล้ว)
  - ปุ่ม: ดูผลโหวต
- **Confirm Dialog**:
  - ยืนยันการโหวต
  - แสดงข้อมูลนักกีฬาที่เลือก
  - ปุ่ม: ยืนยัน, ยกเลิก
- **Success Message**: โหวตสำเร็จ!

### V8. ผลโหวต - แบบ Real-time 🆕
- **URL**: `/viewer/vote/:event_id/results`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - ชื่อการแข่งขัน
  - **Leaderboard Top 10**:
    - อันดับ, รูป, ชื่อ, สี, จำนวนโหวต
    - แสดงแบบ Bar Chart
  - Auto-refresh ทุก 5 วินาที
  - Animation เมื่อคะแนนเปลี่ยน

### V9. รางวัลนักกีฬายอดเยี่ยม 🆕
- **URL**: `/viewer/awards`
- **ผู้เข้าถึง**: Viewer, ทุกคน
- **เนื้อหา**:
  - **MVP รวม (Overall)**:
    - อันดับ 1, 2, 3
    - รูป, ชื่อ, สี, จำนวนโหวต
  - **MVP แต่ละสี**
  - **MVP แต่ละประเภทกีฬา**
  - **รางวัลพิเศษ**
  - แสดงแบบ Podium/Cards สวยงาม
  - ปุ่ม: พิมพ์, Share

---

## 🎯 สรุปจำนวนหน้าจอทั้งหมด

| Role | จำนวนหน้า | หมายเหตุ |
|------|-----------|----------|
| **Public (ไม่ต้อง Login)** | 4 หน้า | Landing, Login, Register, Forgot Password |
| **Admin** | 10 หน้า | ครอบคลุมการจัดการทุกอย่าง |
| **Organizer** | 12 หน้า | จัดการการแข่งขัน + ระบบโหวต |
| **Team Manager** | 8 หน้า | จัดการนักกีฬา + ลงทะเบียน |
| **Viewer** | 9 หน้า | ดูผล + โหวต |
| **รวม** | **43 หน้า** | |

---

# 🛠️ Technology Stack

## Core Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 14.x | App Router, SSR, API Routes |
| **Language** | TypeScript | 5.x | Type Safety |
| **Database** | PostgreSQL | 16.x | Primary Database |
| **ORM** | Prisma | 5.x | Database Access & Migration |
| **Auth** | NextAuth.js | 5.x | Authentication & Sessions |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **UI Library** | shadcn/ui | Latest | Reusable Components |
| **Forms** | React Hook Form | 7.x | Form Management |
| **Validation** | Zod | 3.x | Schema Validation |
| **State** | Zustand | 4.x | Global State Management |
| **Real-time** | Socket.io | 4.x | Live Updates |
| **Charts** | Recharts | 2.x | Data Visualization |
| **Icons** | Lucide React | Latest | Icon Library |
| **Date** | date-fns | 3.x | Date Manipulation |
| **Upload** | Uploadthing | 6.x | File Upload |

---

# 📁 Project File Structure

```
sports-management-system/
├── 📁 prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Seed data
│   └── 📁 migrations/             # Database migrations
│
├── 📁 public/
│   ├── 📁 images/                 # Static images
│   │   ├── logo.svg
│   │   ├── 📁 teams/              # Team color logos
│   │   └── 📁 awards/             # Award images
│   └── 📁 fonts/                  # Custom fonts
│
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page (/)
│   │   ├── globals.css            # Global styles
│   │   ├── loading.tsx            # Global loading
│   │   ├── error.tsx              # Global error
│   │   ├── not-found.tsx          # 404 page
│   │   │
│   │   ├── 📁 (auth)/             # Auth route group
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 register/
│   │   │   │   └── page.tsx
│   │   │   └── 📁 forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 (public)/           # Public pages route group
│   │   │   ├── 📁 leaderboard/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 results/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [eventId]/
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 schedule/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 athletes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 vote/
│   │   │   │   ├── 📁 [eventId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── 📁 results/
│   │   │   │   │       └── page.tsx
│   │   │   └── 📁 awards/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 admin/              # Admin dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── 📁 users/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── 📁 new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 majors/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 colors/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 sport-types/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 scoring-rules/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 awards/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 vote-settings/
│   │   │   │   └── page.tsx
│   │   │   └── 📁 logs/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 organizer/          # Organizer dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── 📁 events/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── 📁 new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── 📁 record/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── 📁 edit-result/
│   │   │   │           └── page.tsx
│   │   │   ├── 📁 schedule/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 voting/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [eventId]/
│   │   │   │       ├── 📁 settings/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── 📁 stats/
│   │   │   │           └── page.tsx
│   │   │   ├── 📁 awards/
│   │   │   │   └── 📁 announce/
│   │   │   │       └── page.tsx
│   │   │   └── 📁 reports/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 team-manager/       # Team Manager dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── 📁 athletes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── 📁 new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 register/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [eventId]/
│   │   │   │       └── page.tsx
│   │   │   ├── 📁 results/
│   │   │   │   └── page.tsx
│   │   │   └── 📁 voting-stats/
│   │   │       └── page.tsx
│   │   │
│   │   └── 📁 api/                # API Routes
│   │       ├── 📁 auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── 📁 users/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       └── route.ts
│   │       ├── 📁 majors/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       └── route.ts
│   │       ├── 📁 colors/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       └── route.ts
│   │       ├── 📁 sport-types/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       └── route.ts
│   │       ├── 📁 events/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       ├── route.ts
│   │       │       ├── 📁 results/
│   │       │       │   └── route.ts
│   │       │       ├── 📁 registrations/
│   │       │       │   └── route.ts
│   │       │       └── 📁 votes/
│   │       │           └── route.ts
│   │       ├── 📁 athletes/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       ├── route.ts
│   │       │       └── 📁 stats/
│   │       │           └── route.ts
│   │       ├── 📁 scoring-rules/
│   │       │   └── route.ts
│   │       ├── 📁 votes/
│   │       │   ├── route.ts
│   │       │   └── 📁 [eventId]/
│   │       │       ├── route.ts
│   │       │       ├── 📁 settings/
│   │       │       │   └── route.ts
│   │       │       └── 📁 stats/
│   │       │           └── route.ts
│   │       ├── 📁 awards/
│   │       │   ├── route.ts
│   │       │   ├── 📁 [id]/
│   │       │   │   └── route.ts
│   │       │   └── 📁 winners/
│   │       │       └── route.ts
│   │       ├── 📁 leaderboard/
│   │       │   └── route.ts
│   │       ├── 📁 announcements/
│   │       │   ├── route.ts
│   │       │   └── 📁 [id]/
│   │       │       └── route.ts
│   │       ├── 📁 logs/
│   │       │   └── route.ts
│   │       └── 📁 upload/
│   │           └── route.ts
│   │
│   ├── 📁 components/             # Shared Components
│   │   ├── 📁 ui/                 # Base UI (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── form.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── ... (more shadcn components)
│   │   │
│   │   ├── 📁 layout/             # Layout Components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── page-header.tsx
│   │   │
│   │   ├── 📁 shared/             # Shared Business Components
│   │   │   ├── leaderboard-card.tsx
│   │   │   ├── team-score-card.tsx
│   │   │   ├── athlete-card.tsx
│   │   │   ├── event-card.tsx
│   │   │   ├── result-podium.tsx
│   │   │   ├── vote-button.tsx
│   │   │   ├── vote-progress.tsx
│   │   │   ├── countdown-timer.tsx
│   │   │   ├── stats-card.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── filter-dropdown.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   └── image-upload.tsx
│   │   │
│   │   ├── 📁 charts/             # Chart Components
│   │   │   ├── score-bar-chart.tsx
│   │   │   ├── vote-line-chart.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   └── leaderboard-chart.tsx
│   │   │
│   │   └── 📁 forms/              # Form Components
│   │       ├── user-form.tsx
│   │       ├── athlete-form.tsx
│   │       ├── event-form.tsx
│   │       ├── major-form.tsx
│   │       ├── color-form.tsx
│   │       ├── sport-type-form.tsx
│   │       ├── vote-settings-form.tsx
│   │       └── award-form.tsx
│   │
│   ├── 📁 lib/                    # Utilities & Config
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth config
│   │   ├── utils.ts               # Utility functions
│   │   ├── validations.ts         # Zod schemas
│   │   ├── constants.ts           # App constants
│   │   └── socket.ts              # Socket.io client
│   │
│   ├── 📁 hooks/                  # Custom React Hooks
│   │   ├── use-auth.ts
│   │   ├── use-leaderboard.ts
│   │   ├── use-votes.ts
│   │   ├── use-events.ts
│   │   ├── use-athletes.ts
│   │   ├── use-realtime.ts
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   │
│   ├── 📁 stores/                 # Zustand Stores
│   │   ├── auth-store.ts
│   │   ├── leaderboard-store.ts
│   │   ├── vote-store.ts
│   │   └── notification-store.ts
│   │
│   ├── 📁 services/               # API Service Layer
│   │   ├── api.ts                 # Base API client
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── event.service.ts
│   │   ├── athlete.service.ts
│   │   ├── vote.service.ts
│   │   ├── leaderboard.service.ts
│   │   └── award.service.ts
│   │
│   ├── 📁 types/                  # TypeScript Types
│   │   ├── index.ts               # Export all types
│   │   ├── user.ts
│   │   ├── event.ts
│   │   ├── athlete.ts
│   │   ├── vote.ts
│   │   ├── award.ts
│   │   ├── api.ts                 # API Response types
│   │   └── prisma.d.ts            # Prisma extended types
│   │
│   └── 📁 middleware/             # API Middleware
│       ├── auth.middleware.ts
│       ├── admin.middleware.ts
│       ├── organizer.middleware.ts
│       ├── team-manager.middleware.ts
│       └── rate-limit.middleware.ts
│
├── 📁 scripts/                    # Utility Scripts
│   ├── seed.ts                    # Database seed
│   └── generate-types.ts          # Type generation
│
├── .env                           # Environment variables
├── .env.example                   # Example env file
├── .eslintrc.json                 # ESLint config
├── .prettierrc                    # Prettier config
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json
└── README.md
```

---

# 🗃️ Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ ENUMS ============

enum Role {
  ADMIN
  ORGANIZER
  TEAM_MANAGER
  VIEWER
}

enum EventStatus {
  UPCOMING
  ONGOING
  COMPLETED
  CANCELLED
}

enum SportCategory {
  INDIVIDUAL
  TEAM
}

enum RegistrationStatus {
  REGISTERED
  CONFIRMED
  DISQUALIFIED
}

enum AnnouncementType {
  GENERAL
  URGENT
  RESULT
}

enum ActionType {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
}

enum AwardType {
  OVERALL
  CATEGORY
  SPECIAL
}

// ============ MODELS ============

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  role      Role     @default(VIEWER)
  majorId   String?
  colorId   String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  major         Major?         @relation(fields: [majorId], references: [id])
  color         Color?         @relation(fields: [colorId], references: [id])
  events        Event[]        @relation("EventCreator")
  eventResults  EventResult[]  @relation("ResultRecorder")
  athletes      Athlete[]      @relation("AthleteRegistrar")
  announcements Announcement[]
  activityLogs  ActivityLog[]
  votes         Vote[]

  @@map("users")
}

model Major {
  id        String   @id @default(cuid())
  name      String
  code      String   @unique
  colorId   String?
  createdAt DateTime @default(now())

  color    Color?    @relation(fields: [colorId], references: [id])
  users    User[]
  athletes Athlete[]

  @@map("majors")
}

model Color {
  id         String   @id @default(cuid())
  name       String   @unique
  hexCode    String
  totalScore Int      @default(0)
  createdAt  DateTime @default(now())

  majors             Major[]
  users              User[]
  athletes           Athlete[]
  eventRegistrations EventRegistration[]
  eventResults       EventResult[]

  @@map("colors")
}

model SportType {
  id              String        @id @default(cuid())
  name            String
  category        SportCategory
  maxParticipants Int?
  description     String?
  createdAt       DateTime      @default(now())

  events Event[]

  @@map("sport_types")
}

model Event {
  id          String      @id @default(cuid())
  sportTypeId String
  name        String
  date        DateTime
  time        DateTime
  location    String?
  status      EventStatus @default(UPCOMING)
  createdById String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  sportType     SportType           @relation(fields: [sportTypeId], references: [id])
  createdBy     User?               @relation("EventCreator", fields: [createdById], references: [id])
  scoringRules  ScoringRule[]
  registrations EventRegistration[]
  results       EventResult[]
  voteSettings  VoteSetting?
  votes         Vote[]

  @@map("events")
}

model ScoringRule {
  id        String   @id @default(cuid())
  eventId   String?
  rank      Int
  points    Int
  createdAt DateTime @default(now())

  event Event? @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@map("scoring_rules")
}

model Athlete {
  id           String   @id @default(cuid())
  studentId    String   @unique
  firstName    String
  lastName     String
  majorId      String
  colorId      String
  photoUrl     String?
  registeredBy String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  major            Major               @relation(fields: [majorId], references: [id])
  color            Color               @relation(fields: [colorId], references: [id])
  registrar        User?               @relation("AthleteRegistrar", fields: [registeredBy], references: [id])
  registrations    EventRegistration[]
  individualResult EventResult[]
  votes            Vote[]
  voteSummary      AthleteVoteSummary[]
  awardWinners     AwardWinner[]

  @@map("athletes")
}

model EventRegistration {
  id           String             @id @default(cuid())
  eventId      String
  athleteId    String
  colorId      String
  status       RegistrationStatus @default(REGISTERED)
  registeredAt DateTime           @default(now())

  event   Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  athlete Athlete @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  color   Color   @relation(fields: [colorId], references: [id])

  @@unique([eventId, athleteId])
  @@map("event_registrations")
}

model EventResult {
  id         String   @id @default(cuid())
  eventId    String
  colorId    String
  athleteId  String?
  rank       Int
  points     Int
  notes      String?
  recordedBy String?
  recordedAt DateTime @default(now())
  updatedAt  DateTime @updatedAt

  event    Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  color    Color    @relation(fields: [colorId], references: [id])
  athlete  Athlete? @relation(fields: [athleteId], references: [id])
  recorder User?    @relation("ResultRecorder", fields: [recordedBy], references: [id])

  @@map("event_results")
}

model Announcement {
  id        String           @id @default(cuid())
  title     String
  content   String
  type      AnnouncementType @default(GENERAL)
  createdBy String?
  createdAt DateTime         @default(now())

  author User? @relation(fields: [createdBy], references: [id])

  @@map("announcements")
}

model ActivityLog {
  id        String     @id @default(cuid())
  userId    String?
  action    ActionType
  tableName String?
  recordId  String?
  oldValue  Json?
  newValue  Json?
  ipAddress String?
  createdAt DateTime   @default(now())

  user User? @relation(fields: [userId], references: [id])

  @@map("activity_logs")
}

model VoteSetting {
  id                  String   @id @default(cuid())
  eventId             String?  @unique
  votingEnabled       Boolean  @default(true)
  votingStart         DateTime?
  votingEnd           DateTime?
  maxVotesPerUser     Int      @default(1)
  showRealtimeResults Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  event Event? @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@map("vote_settings")
}

model Vote {
  id            String   @id @default(cuid())
  eventId       String
  athleteId     String
  voterIp       String?
  voterUserId   String?
  voterDeviceId String?
  voteReason    String?
  isValid       Boolean  @default(true)
  votedAt       DateTime @default(now())

  event   Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  athlete Athlete @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  voter   User?   @relation(fields: [voterUserId], references: [id])

  @@index([eventId, athleteId])
  @@index([eventId, voterIp])
  @@index([eventId, voterDeviceId])
  @@map("votes")
}

model AthleteVoteSummary {
  id          String   @id @default(cuid())
  athleteId   String
  eventId     String?
  totalVotes  Int      @default(0)
  rank        Int?
  lastUpdated DateTime @default(now()) @updatedAt

  athlete Athlete @relation(fields: [athleteId], references: [id], onDelete: Cascade)

  @@unique([athleteId, eventId])
  @@map("athlete_vote_summary")
}

model Award {
  id           String    @id @default(cuid())
  name         String
  description  String?
  awardType    AwardType
  category     String?
  criteria     Json?
  prizeDetails String?
  imageUrl     String?
  displayOrder Int?
  createdAt    DateTime  @default(now())

  winners AwardWinner[]

  @@map("awards")
}

model AwardWinner {
  id            String    @id @default(cuid())
  awardId       String
  athleteId     String
  votesReceived Int?
  score         Float?
  rank          Int?
  announcedAt   DateTime?
  claimed       Boolean   @default(false)
  createdAt     DateTime  @default(now())

  award   Award   @relation(fields: [awardId], references: [id], onDelete: Cascade)
  athlete Athlete @relation(fields: [athleteId], references: [id], onDelete: Cascade)

  @@map("award_winners")
}
```

---

# 📡 API Specification

## Base URL
```
Production: https://api.example.com/api
Development: http://localhost:3000/api
```

## Response Format
```typescript
// Success Response
{
  "success": true,
  "data": T,
  "message": "Success message"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}

// Paginated Response
{
  "success": true,
  "data": T[],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🔐 Authentication APIs

### POST /api/auth/login
Login user and get session token.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "ADMIN | ORGANIZER | TEAM_MANAGER | VIEWER"
    },
    "token": "jwt_token"
  }
}
```

### POST /api/auth/register
Register new viewer account.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### POST /api/auth/logout
Logout current user.

### POST /api/auth/forgot-password
Request password reset.

**Request:**
```json
{
  "email": "string"
}
```

---

## 👥 Users APIs (Admin Only)

### GET /api/users
Get all users with pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| role | string | Filter by role |
| search | string | Search by username/email |
| isActive | boolean | Filter by status |

### GET /api/users/:id
Get user by ID.

### POST /api/users
Create new user.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN | ORGANIZER | TEAM_MANAGER | VIEWER",
  "majorId": "string?",
  "colorId": "string?"
}
```

### PUT /api/users/:id
Update user.

### DELETE /api/users/:id
Delete user.

### PATCH /api/users/:id/toggle-status
Toggle user active status.

---

## 🏢 Majors APIs

### GET /api/majors
Get all majors.

### GET /api/majors/:id
Get major by ID.

### POST /api/majors (Admin)
Create new major.

**Request:**
```json
{
  "name": "string",
  "code": "string",
  "colorId": "string?"
}
```

### PUT /api/majors/:id (Admin)
Update major.

### DELETE /api/majors/:id (Admin)
Delete major.

---

## 🎨 Colors APIs

### GET /api/colors
Get all colors with total scores.

### GET /api/colors/:id
Get color by ID with details.

### POST /api/colors (Admin)
Create new color.

**Request:**
```json
{
  "name": "string",
  "hexCode": "string"
}
```

### PUT /api/colors/:id (Admin)
Update color.

### DELETE /api/colors/:id (Admin)
Delete color.

---

## ⚽ Sport Types APIs

### GET /api/sport-types
Get all sport types.

### GET /api/sport-types/:id
Get sport type by ID.

### POST /api/sport-types (Admin)
Create new sport type.

**Request:**
```json
{
  "name": "string",
  "category": "INDIVIDUAL | TEAM",
  "maxParticipants": "number?",
  "description": "string?"
}
```

### PUT /api/sport-types/:id (Admin)
Update sport type.

### DELETE /api/sport-types/:id (Admin)
Delete sport type.

---

## 📅 Events APIs

### GET /api/events
Get all events.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status |
| sportTypeId | string | Filter by sport type |
| date | string | Filter by date |
| page | number | Page number |
| limit | number | Items per page |

### GET /api/events/:id
Get event by ID with full details.

### POST /api/events (Organizer)
Create new event.

**Request:**
```json
{
  "sportTypeId": "string",
  "name": "string",
  "date": "ISO date",
  "time": "ISO time",
  "location": "string?",
  "status": "UPCOMING"
}
```

### PUT /api/events/:id (Organizer)
Update event.

### DELETE /api/events/:id (Organizer)
Delete event.

### PATCH /api/events/:id/status (Organizer)
Update event status.

**Request:**
```json
{
  "status": "UPCOMING | ONGOING | COMPLETED | CANCELLED"
}
```

---

## 📊 Event Results APIs

### GET /api/events/:id/results
Get results for an event.

### POST /api/events/:id/results (Organizer)
Record event results.

**Request:**
```json
{
  "results": [
    {
      "colorId": "string",
      "athleteId": "string?",
      "rank": 1,
      "points": 10,
      "notes": "string?"
    }
  ]
}
```

### PUT /api/events/:id/results (Organizer)
Update event results.

**Request:**
```json
{
  "results": [...],
  "reason": "string (required)"
}
```

---

## 📋 Event Registrations APIs

### GET /api/events/:id/registrations
Get registrations for an event.

### POST /api/events/:id/registrations (Team Manager)
Register athletes to event.

**Request:**
```json
{
  "athleteIds": ["string"]
}
```

### DELETE /api/events/:id/registrations/:athleteId (Team Manager)
Remove athlete from event.

---

## 🏃 Athletes APIs

### GET /api/athletes
Get all athletes.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| colorId | string | Filter by color |
| majorId | string | Filter by major |
| search | string | Search by name/studentId |
| page | number | Page number |
| limit | number | Items per page |

### GET /api/athletes/:id
Get athlete by ID with full stats.

### POST /api/athletes (Team Manager)
Create new athlete.

**Request:**
```json
{
  "studentId": "string",
  "firstName": "string",
  "lastName": "string",
  "majorId": "string",
  "colorId": "string",
  "photoUrl": "string?"
}
```

### PUT /api/athletes/:id (Team Manager)
Update athlete.

### DELETE /api/athletes/:id (Team Manager)
Delete athlete.

### GET /api/athletes/:id/stats
Get athlete statistics (events, votes, rankings).

---

## 🗳️ Voting APIs

### GET /api/votes/:eventId
Get votes for an event.

### POST /api/votes/:eventId (Viewer)
Cast a vote.

**Request:**
```json
{
  "athleteId": "string",
  "reason": "string?"
}
```

**Headers:**
```
X-Device-Id: device_fingerprint
```

### GET /api/votes/:eventId/stats
Get voting statistics for an event.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVotes": 150,
    "rankings": [
      {
        "rank": 1,
        "athleteId": "string",
        "athleteName": "string",
        "colorId": "string",
        "votes": 45
      }
    ]
  }
}
```

### GET /api/votes/:eventId/settings
Get vote settings for an event.

### PUT /api/votes/:eventId/settings (Organizer)
Update vote settings.

**Request:**
```json
{
  "votingEnabled": true,
  "votingStart": "ISO datetime",
  "votingEnd": "ISO datetime",
  "maxVotesPerUser": 1,
  "showRealtimeResults": true
}
```

### POST /api/votes/:eventId/toggle (Organizer)
Toggle voting on/off.

---

## 🏆 Awards APIs

### GET /api/awards
Get all awards.

### GET /api/awards/:id
Get award by ID.

### POST /api/awards (Admin)
Create new award.

**Request:**
```json
{
  "name": "string",
  "description": "string?",
  "awardType": "OVERALL | CATEGORY | SPECIAL",
  "category": "string?",
  "prizeDetails": "string?",
  "imageUrl": "string?"
}
```

### PUT /api/awards/:id (Admin)
Update award.

### DELETE /api/awards/:id (Admin)
Delete award.

### GET /api/awards/winners
Get all award winners.

### POST /api/awards/winners (Organizer)
Announce award winners.

**Request:**
```json
{
  "winners": [
    {
      "awardId": "string",
      "athleteId": "string",
      "rank": 1
    }
  ]
}
```

---

## 📊 Leaderboard APIs

### GET /api/leaderboard
Get current leaderboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "colors": [
      {
        "id": "string",
        "name": "แดง",
        "hexCode": "#FF0000",
        "totalScore": 250,
        "rank": 1
      }
    ],
    "lastUpdated": "ISO datetime"
  }
}
```

### GET /api/leaderboard/history
Get leaderboard history over time.

---

## 📢 Announcements APIs

### GET /api/announcements
Get all announcements.

### GET /api/announcements/:id
Get announcement by ID.

### POST /api/announcements (Organizer)
Create announcement.

**Request:**
```json
{
  "title": "string",
  "content": "string",
  "type": "GENERAL | URGENT | RESULT"
}
```

### PUT /api/announcements/:id (Organizer)
Update announcement.

### DELETE /api/announcements/:id (Organizer)
Delete announcement.

---

## 📜 Activity Logs APIs (Admin Only)

### GET /api/logs
Get activity logs.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| userId | string | Filter by user |
| action | string | Filter by action type |
| startDate | string | Start date range |
| endDate | string | End date range |
| page | number | Page number |
| limit | number | Items per page |

### GET /api/logs/export
Export logs to CSV.

---

## 📤 Upload APIs

### POST /api/upload
Upload file (image).

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| file | File | Image file |
| type | string | "athlete" \| "award" \| "announcement" |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/image.jpg"
  }
}
```

---

## 📋 Scoring Rules APIs

### GET /api/scoring-rules
Get default scoring rules.

### PUT /api/scoring-rules (Admin)
Update default scoring rules.

**Request:**
```json
{
  "rules": [
    { "rank": 1, "points": 10 },
    { "rank": 2, "points": 8 },
    { "rank": 3, "points": 6 },
    { "rank": 4, "points": 4 }
  ]
}
```

---

# 🧩 Shared Components

## UI Components (shadcn/ui based)

| Component | Description |
|-----------|-------------|
| `Button` | Primary, Secondary, Outline, Ghost variants |
| `Card` | Container with header, content, footer |
| `Input` | Text input with validation |
| `Select` | Dropdown select |
| `Dialog` | Modal dialog |
| `Table` | Data table with sorting |
| `Badge` | Status badges |
| `Avatar` | User/Athlete avatar |
| `Toast` | Notification toasts |
| `Skeleton` | Loading placeholders |

## Business Components

| Component | Description | Used In |
|-----------|-------------|---------|
| `LeaderboardCard` | Big score display card | Landing, Viewer |
| `TeamScoreCard` | Color team score | All dashboards |
| `AthleteCard` | Athlete profile card | Athletes list |
| `EventCard` | Event summary card | Events list |
| `ResultPodium` | Podium display (1,2,3) | Results page |
| `VoteButton` | Vote with animation | Vote page |
| `VoteProgress` | Vote progress bar | Stats page |
| `CountdownTimer` | Countdown display | Vote page |
| `StatsCard` | Statistics card | Dashboards |
| `DataTable` | Sortable/Filterable table | Admin pages |
| `ConfirmDialog` | Confirmation modal | All forms |

---

# 🎨 Design System

## Colors
```css
:root {
  /* Primary Colors */
  --primary: #4F46E5;         /* Indigo */
  --primary-hover: #4338CA;
  
  /* Team Colors */
  --team-red: #EF4444;
  --team-yellow: #EAB308;
  --team-green: #22C55E;
  --team-blue: #3B82F6;
  
  /* Semantic Colors */
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Neutral */
  --background: #0F172A;
  --foreground: #F8FAFC;
  --card: #1E293B;
  --border: #334155;
  --muted: #64748B;
}
```

## Typography
```css
/* Font Family */
font-family: 'Noto Sans Thai', 'Inter', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

## Spacing
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
```

---

# 🚀 Getting Started

## Prerequisites
- Node.js 18+
- PostgreSQL 16+
- npm or pnpm

## Installation

```bash
# Clone repository
git clone <repo-url>
cd sports-management-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Start development server
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sports_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Upload (Uploadthing)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-app-id"

# Socket.io (optional)
SOCKET_URL="http://localhost:3001"
```
