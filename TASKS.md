# 📋 Sports Management System - Task Breakdown

## Project Overview
**ระบบจัดการกีฬาสีคณะวิทยาการสารสนเทศ** พร้อมระบบโหวตนักกีฬายอดเยี่ยม

**Tech Stack:** Next.js 14 + Prisma + PostgreSQL + Tailwind CSS + shadcn/ui

---

# 🎯 Phase 1: Project Setup & Foundation
**Duration:** 2 วัน | **Priority:** 🔴 Critical

## Task 1.1: Initialize Next.js Project
- [x] Create Next.js project with App Router
- [x] Configure TypeScript
- [x] Setup ESLint
- [x] Configure path aliases (@/)
- [x] Create folder structure as per Design.md

**Commands:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

## Task 1.2: Setup Prisma & PostgreSQL
- [x] Install Prisma CLI & Client
- [x] Initialize Prisma with PostgreSQL
- [x] Create `.env` with DATABASE_URL
- [x] Write complete Prisma schema (16 models)
- [x] Run initial migration / db push
- [x] Create seed script with initial data and run it

**Commands:**
```bash
npm install prisma @prisma/client
npx prisma init
npx prisma migrate dev --name init
npx prisma db seed
```

## Task 1.3: Setup UI Framework
- [x] Install & Configure shadcn/ui
- [x] Setup Tailwind CSS with custom theme
- [x] Install Lucide React icons
- [x] Create design tokens (colors, fonts, spacing)
- [x] Setup Google Fonts (Noto Sans Thai, Inter)

**Commands:**
```bash
npx shadcn@latest init
npx shadcn@latest add button card input select dialog table tabs badge avatar toast
```

## Task 1.4: Setup Authentication
- [x] Install NextAuth.js v5
- [x] Configure Credentials Provider
- [x] Create auth.ts configuration
- [x] Setup session management
- [x] Create auth middleware
- [x] Implement role-based access control

**Commands:**
```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

## Task 1.5: Setup Additional Dependencies
- [x] Install form libraries (react-hook-form, zod)
- [x] Install state management (zustand)
- [x] Install utilities (date-fns, clsx, tailwind-merge)
- [x] Install charts (recharts)
- [ ] Setup Socket.io for real-time (optional)

**Commands:**
```bash
npm install react-hook-form @hookform/resolvers zod
npm install zustand
npm install date-fns clsx tailwind-merge
npm install recharts
```

---

# 🎯 Phase 2: Core Components & Layouts
**Duration:** 3 วัน | **Priority:** 🔴 Critical

## Task 2.1: Base UI Components (shadcn)
- [x] Button (variants: primary, secondary, outline, ghost, destructive)
- [x] Card (header, content, footer)
- [x] Input (with label, error state)
- [x] Select (single, searchable)
- [x] Dialog (modal, confirmation)
- [x] Table (sortable, pagination)
- [x] Form (with react-hook-form integration)
- [x] Badge (status colors)
- [x] Avatar (with fallback)
- [x] Toast (success, error, warning, info)
- [x] Skeleton (loading states)
- [x] Calendar (date picker)
- [x] Checkbox, Popover, Separator, Dropdown Menu, Sheet, Breadcrumb, Pagination, ScrollArea

## Task 2.2: Layout Components
- [x] `Header` - Logo, navigation, user menu
- [x] `Footer` - Links, copyright
- [x] `Sidebar` - Navigation menu for dashboards
- [x] `MobileNav` - Responsive navigation (integrated in Header)
- [x] `Breadcrumb` - Navigation path
- [x] `PageHeader` - Title, description, actions

## Task 2.3: Shared Business Components
- [x] `LeaderboardCard` - Big score display with animation
- [x] `TeamScoreCard` - Color team score with rank
- [x] `AthleteCard` - Athlete profile card
- [x] `EventCard` - Event summary card
- [x] `ResultPodium` - Podium display (1,2,3)
- [x] `VoteButton` - Vote with animation & feedback
- [x] `VoteProgress` - Vote progress bar
- [x] `CountdownTimer` - Countdown display
- [x] `StatsCard` - Statistics card with icon
- [x] `DataTable` - Sortable, filterable, paginated table
- [x] `SearchInput` - Debounced search input
- [x] `FilterDropdown` - Multi-select filter
- [x] `EmptyState` - Empty data state
- [x] `LoadingSpinner` - Loading indicator
- [x] `ConfirmDialog` - Confirmation modal
- [x] `ImageUpload` - Image upload with preview

## Task 2.4: Chart Components
- [x] `ScoreBarChart` - Team scores bar chart
- [x] `VoteLineChart` - Votes over time
- [x] `PieChart` - Distribution pie chart
- [x] `LeaderboardChart` - Animated leaderboard

## Task 2.5: Form Components
- [x] `UserForm` - Create/Edit user
- [x] `AthleteForm` - Create/Edit athlete
- [x] `EventForm` - Create/Edit event
- [x] `MajorForm` - Create/Edit major
- [x] `ColorForm` - Create/Edit color
- [x] `SportTypeForm` - Create/Edit sport type
- [x] `VoteSettingsForm` - Vote settings
- [x] `AwardForm` - Create/Edit award

---

# 🎯 Phase 3: API Routes
**Duration:** 4 วัน | **Priority:** 🔴 Critical

## Task 3.1: Auth APIs
- [x] POST `/api/auth/login` - Login with credentials (NextAuth)
- [x] POST `/api/auth/register` - Register viewer
- [x] POST `/api/auth/logout` - Logout (NextAuth)
- [x] POST `/api/auth/forgot-password` - Request password reset
- [x] GET `/api/auth/session` - Get current session (NextAuth)

## Task 3.2: Users APIs (Admin)
- [x] GET `/api/users` - List users (pagination, filter, search)
- [x] GET `/api/users/:id` - Get user by ID
- [x] POST `/api/users` - Create user
- [x] PUT `/api/users/:id` - Update user
- [x] DELETE `/api/users/:id` - Delete user
- [x] PATCH `/api/users/:id/toggle-status` - Toggle active status

## Task 3.3: Master Data APIs
- [x] CRUD `/api/majors` - Majors management
- [x] CRUD `/api/colors` - Colors management
- [x] CRUD `/api/sport-types` - Sport types management
- [x] GET/PUT `/api/scoring-rules` - Scoring rules

## Task 3.4: Events APIs
- [x] GET `/api/events` - List events (filter by status, sport, date)
- [x] GET `/api/events/:id` - Get event details
- [x] POST `/api/events` - Create event
- [x] PUT `/api/events/:id` - Update event
- [x] DELETE `/api/events/:id` - Delete event
- [x] PATCH `/api/events/:id/status` - Update status
- [x] GET `/api/events/:id/results` - Get results
- [x] POST `/api/events/:id/results` - Record results
- [x] PUT `/api/events/:id/results` - Update results
- [x] GET `/api/events/:id/registrations` - Get registrations
- [x] POST `/api/events/:id/registrations` - Register athletes

## Task 3.5: Athletes APIs
- [x] GET `/api/athletes` - List athletes (filter, search)
- [x] GET `/api/athletes/:id` - Get athlete details
- [x] POST `/api/athletes` - Create athlete
- [x] PUT `/api/athletes/:id` - Update athlete
- [x] DELETE `/api/athletes/:id` - Delete athlete
- [x] GET `/api/athletes/:id/stats` - Get athlete statistics

## Task 3.6: Voting APIs
- [x] GET `/api/votes/:eventId` - Get votes for event
- [x] POST `/api/votes/:eventId` - Cast vote
- [x] GET `/api/votes/:eventId/stats` - Get vote statistics
- [x] GET `/api/votes/:eventId/settings` - Get vote settings
- [x] PUT `/api/votes/:eventId/settings` - Update settings
- [x] POST `/api/votes/:eventId/toggle` - Toggle voting

## Task 3.7: Awards APIs
- [x] CRUD `/api/awards` - Awards management
- [x] GET `/api/awards/winners` - Get all winners
- [x] POST `/api/awards/winners` - Announce winners

## Task 3.8: Other APIs
- [x] GET `/api/leaderboard` - Get leaderboard
- [x] GET `/api/leaderboard/history` - Get history
- [x] CRUD `/api/announcements` - Announcements
- [x] GET `/api/logs` - Activity logs (Admin)
- [x] POST `/api/upload` - File upload

---

# 🎯 Phase 4: Public Pages
**Duration:** 3 วัน | **Priority:** 🔴 Critical

## Task 4.1: Landing Page (/)
- [x] Hero banner with sports day theme
- [x] Real-time leaderboard cards
- [x] Auto-refresh every 10 seconds (via revalidate)
- [x] Responsive design
- [x] Login button
- [x] Quick links to results, schedule

## Task 4.2: Auth Pages
- [x] `/login` - Login page with form
- [x] `/register` (Placeholder/Internal)
- [x] `/forgot-password` (Placeholder)
- [x] Form validation with Zod
- [x] Error handling & toast messages (Sonner)

## Task 4.3: Leaderboard Page (/leaderboard)
- [x] Big display of all team scores
- [x] Real-time updates
- [x] Score animation when changed
- [x] Bar chart visualization
- [x] Responsive for TV display

## Task 4.4: Results Pages
- [x] `/results` - List all completed events
- [x] `/results/:eventId` - Event result details
- [x] Podium display for top 3
- [x] Filter by sport type, date
- [x] Share buttons (Facebook, Line)

## Task 4.5: Schedule Page (/schedule)
- [x] Calendar view (month/week/day)
- [x] List view for mobile
- [x] Filter by sport, status
- [x] Add to Google Calendar button

## Task 4.6: Athletes Pages
- [x] `/athletes` - All athletes grid
- [x] `/athletes/:id` - Athlete profile
- [x] Filter by color, major
- [x] Search by name/student ID
- [x] Statistics display

## Task 4.7: Voting Pages
- [x] `/vote/:eventId` - Vote for athletes
- [x] `/vote/:eventId/results` - Vote results
- [x] Countdown timer
- [x] Real-time vote counts
- [x] Prevent duplicate votes

## Task 4.8: Awards Page (/awards)
- [x] Display all award categories
- [x] Winner podium display
- [x] MVP cards with photos
- [x] Animated reveal

---

# 🎯 Phase 5: Admin Dashboard
**Duration:** 3 วัน | **Priority:** 🟡 High
**Status:** ✅ 100% Complete

## Task 5.1: Admin Layout
- [x] Sidebar navigation
- [x] Header with user menu
- [x] Breadcrumb navigation
- [x] Protected routes (Admin only)

## Task 5.2: Admin Dashboard (/admin)
- [x] Statistics cards (users, events, athletes, votes)
- [x] Score chart by team
- [x] Recent activity logs
- [x] Quick action buttons

## Task 5.3: User Management
- [x] `/admin/users` - Users table with CRUD
- [x] `/admin/users/new` - Create user form
- [x] `/admin/users/:id` - Edit user form
- [x] Role assignment
- [x] Lock/unlock user

## Task 5.4: Master Data Management
- [x] `/admin/majors` - Majors management
- [x] `/admin/colors` - Colors management
- [x] `/admin/sport-types` - Sport types management
- [x] `/admin/scoring-rules` - Scoring rules

## Task 5.5: Awards & Settings
- [x] `/admin/awards` - Awards management
- [x] `/admin/vote-settings` - Global vote settings
- [x] `/admin/logs` - Activity logs viewer

---

# 🏆 Phase 6: Organizer Dashboard
**Duration:** 3 วัน | **Priority:** 🟡 High
**Status:** ✅ 100% Complete

## Task 6.1: Organizer Layout
- [x] Sidebar navigation (Emerald theme)
- [x] Middlewares for role protection
- [x] Breadcrumb navigation

## Task 6.2: Organizer Dashboard (/organizer)
- [x] Today's events overview
- [x] Recent competition results feed
- [x] Statistics cards
- [x] Quick access to event recording

## Task 6.3: Events Management
- [x] `/organizer/events` - Main competition table
- [x] `/organizer/events/new` - Manual event creation
- [x] `/organizer/events/:id` - Record/Update result entry
- [x] `/organizer/events/:id/edit` - Competition details edit
- [x] Status management (Upcoming -> Ongoing -> Completed)

## Task 6.4: Schedule & Reports
- [x] `/organizer/schedule` - Weekly calendar view for staff
- [x] `/organizer/reports` - Comprehensive analytics dashboard
- [x] Chart visualizations (Points, Medals, Top Athletes)
- [x] Export result reports (PDF/Excel) - *Moving to Phase 7 (Reports)*

## Task 6.5: Voting & Awards Management
- [x] `/organizer/voting` - Event-specific vote settings
- [x] Monitor real-time votes per event
- [x] Opening/Closing voting sessions via settings
- [x] `/organizer/awards/announce` - Announce MVP/Special winners
- [x] `/organizer/voting/:eventId/settings` - Vote settings
- [x] `/organizer/voting/:eventId/stats` - Real-time stats
- [x] `/organizer/awards/announce` - Announce winners

---

# 🏆 Phase 7: Team Manager Dashboard
**Duration:** 3 วัน | **Priority:** 🟡 High
**Status:** ✅ 100% Complete

## Task 7.1: Team Manager Layout
- [x] Sidebar navigation (Indigo theme)
- [x] Header with team color indicator
- [x] Protected routes (Team Manager restricted to their color)

## Task 7.2: Team Manager Dashboard (/team-manager)
- [x] Team score & statistics Overview
- [x] Athlete & Registration counts
- [x] Upcoming competition timeline
- [x] Recent team successes feed

## Task 7.3: Athletes Management
- [x] `/team-manager/athletes` - Team-specific athletes list
- [x] `/team-manager/athletes/new` - Register new athlete (Auto-lock color)
- [x] `/team-manager/athletes/:id/edit` - Modify athlete (Ownership check)

## Task 7.4: Event Registration
- [x] `/team-manager/register` - Available upcoming events
- [x] `/team-manager/register/:eventId` - Select & Batch register athletes
- [x] Security: Prevent cross-team registration in API

## Task 7.5: Results & Statistics
- [x] `/team-manager/results` - Performance ledger & medal count
- [x] `/team-manager/voting-stats` - Popularity leaderboard & vote analytics

---

# 🚀 Phase 8: Real-time & Polish
**Duration:** 2 วัน | **Priority:** 🔴 Critical
**Status:** ✅ 100% Complete

## Task 8.1: Real-time Updates
- [x] Implement `/api/public/tv-stats` for live feeds
- [x] Auto-polling logic (15s) for Leaderboard & Voting Results
- [x] Stadium Display Mode (`/tv`) for real-time broadcast
- [x] Public page auto-refresh (Results & Event details)

## Task 8.2: Responsive Design
- [x] Immersive TV Mode (Big screen optimized)
- [x] Mobile-friendly Navigation & Forms
- [x] Touch-friendly voting interface
- [x] Layout adjustments for all screen sizes

## Task 8.3: Performance Optimization
- [x] API Route throttling & revalidation
- [x] Database indexing for fast aggregates (schema.prisma indexes added)
- [x] Optimized polling strategy to reduce server load
- [x] Component lazy loading & skeleton states

## Task 8.4: Testing & Bug Fixes
- [x] Fix missing component imports (Card, CardContent)
- [x] Security audit for Team Manager endpoints
- [x] Cross-browser testing (Standard modern browsers)
- [x] Final end-to-end testing
- [x] UI/UX Final polish

---

# 🎯 Phase 9: Deployment & Documentation
**Duration:** 1 วัน | **Priority:** 🟢 Medium

## Task 9.1: Deployment Setup
- [ ] Environment configuration
- [ ] Database migration (production)
- [ ] Vercel/Railway deployment
- [ ] Domain configuration

## Task 9.2: Documentation
- [ ] README.md
- [ ] API documentation
- [ ] User guide
- [ ] Admin guide

## Task 9.3: Final Checklist
- [ ] Security audit
- [ ] Performance audit
- [ ] Accessibility check
- [ ] SEO optimization

---

# 📊 Summary

| Phase | Tasks | Duration | Priority |
|-------|-------|----------|----------|
| Phase 1: Project Setup | 5 tasks | 2 days | 🔴 Critical |
| Phase 2: Core Components | 5 tasks | 3 days | 🔴 Critical |
| Phase 3: API Routes | 8 tasks | 4 days | 🔴 Critical |
| Phase 4: Public Pages | 8 tasks | 3 days | 🔴 Critical |
| Phase 5: Admin Dashboard | 5 tasks | 3 days | 🟡 High |
| Phase 6: Organizer Dashboard | 5 tasks | 4 days | 🟡 High |
| Phase 7: Team Manager Dashboard | 5 tasks | 3 days | 🟡 High |
| Phase 8: Real-time & Polish | 4 tasks | 2 days | 🟢 Medium |
| Phase 9: Deployment | 3 tasks | 1 day | 🟢 Medium |
| **Total** | **48 tasks** | **25 days** | |

---

# 🚦 Current Progress

## ✅ Completed
- [x] Design.md - System design document
- [x] TASKS.md - Task breakdown
- [x] **Phase 1**: Project Foundation (Complete)
- [x] **Phase 4.1**: Landing Page (Leaderboard/Hero)
- [x] **Phase 4.2**: Login Page (Auth logic + Glassmorphism UI)

- [x] Phase 2: Core Components & Layouts (100% Complete)
- [x] Phase 3: API Routes (100% Complete)

## 📝 Next Up
## 📝 Next Up
- Phase 4: Public Pages (Remaining)
- Phase 5: Admin Dashboard UI
- Phase 6: Organizer Dashboard UI

---

# 📌 Notes

## Dependencies
- Phase 2 depends on Phase 1
- Phase 3-4 can run in parallel after Phase 2
- Phase 5-7 depend on Phase 3
- Phase 8-9 depend on all previous phases

## Risk Areas
- Real-time updates may need additional infrastructure
- Vote anti-spam might need refinement
- Mobile responsiveness needs extra testing

## Quick Wins
- Start with public pages (visible progress)
- Use shadcn/ui for fast component development
- Leverage Prisma for rapid API development
