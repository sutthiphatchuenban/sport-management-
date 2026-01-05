// Application Constants

export const APP_NAME = 'ระบบจัดการกีฬาสี'
export const APP_DESCRIPTION = 'ระบบจัดการการแข่งขันกีฬาสีคณะวิทยาการสารสนเทศ พร้อมระบบโหวตนักกีฬายอดเยี่ยม'

// Roles
export const ROLES = {
    ADMIN: 'ADMIN',
    ORGANIZER: 'ORGANIZER',
    TEAM_MANAGER: 'TEAM_MANAGER',
    VIEWER: 'VIEWER',
} as const

export const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'ผู้ดูแลระบบ',
    ORGANIZER: 'สโมสรนิสิต',
    TEAM_MANAGER: 'ตัวแทนสาขา',
    VIEWER: 'ผู้ชม',
}

// Event Status
export const EVENT_STATUS = {
    UPCOMING: 'UPCOMING',
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const

export const EVENT_STATUS_LABELS: Record<string, string> = {
    UPCOMING: 'กำลังจะแข่ง',
    ONGOING: 'กำลังแข่งขัน',
    COMPLETED: 'เสร็จสิ้น',
    CANCELLED: 'ยกเลิก',
}

export const EVENT_STATUS_COLORS: Record<string, string> = {
    UPCOMING: 'bg-blue-100 text-blue-800',
    ONGOING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
}

// Sport Category
export const SPORT_CATEGORY = {
    INDIVIDUAL: 'INDIVIDUAL',
    TEAM: 'TEAM',
} as const

export const SPORT_CATEGORY_LABELS: Record<string, string> = {
    INDIVIDUAL: 'บุคคล',
    TEAM: 'ทีม',
}

// Default Scoring Rules
export const DEFAULT_SCORING_RULES = [
    { rank: 1, points: 10 },
    { rank: 2, points: 8 },
    { rank: 3, points: 6 },
    { rank: 4, points: 4 },
]

// Team Colors (Default)
export const TEAM_COLORS = [
    { name: 'แดง', hexCode: '#EF4444' },
    { name: 'เหลือง', hexCode: '#EAB308' },
    { name: 'เขียว', hexCode: '#22C55E' },
    { name: 'น้ำเงิน', hexCode: '#3B82F6' },
]

// Navigation
export const ADMIN_NAV = [
    { label: 'แดชบอร์ด', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'ผู้ใช้งาน', href: '/admin/users', icon: 'Users' },
    { label: 'สาขา', href: '/admin/majors', icon: 'Building2' },
    { label: 'สี', href: '/admin/colors', icon: 'Palette' },
    { label: 'ประเภทกีฬา', href: '/admin/sport-types', icon: 'Trophy' },
    { label: 'เกณฑ์คะแนน', href: '/admin/scoring-rules', icon: 'Calculator' },
    { label: 'รางวัล', href: '/admin/awards', icon: 'Award' },
    { label: 'ตั้งค่าโหวต', href: '/admin/vote-settings', icon: 'Settings' },
    { label: 'ประวัติการใช้งาน', href: '/admin/logs', icon: 'History' },
]

export const ORGANIZER_NAV = [
    { label: 'แดชบอร์ด', href: '/organizer', icon: 'LayoutDashboard' },
    { label: 'การแข่งขัน', href: '/organizer/events', icon: 'Calendar' },
    { label: 'ตารางแข่ง', href: '/organizer/schedule', icon: 'CalendarDays' },
    { label: 'ระบบโหวต', href: '/organizer/voting', icon: 'Vote' },
    { label: 'ประกาศรางวัล', href: '/organizer/awards/announce', icon: 'Award' },
    { label: 'รายงาน', href: '/organizer/reports', icon: 'BarChart3' },
]

export const TEAM_MANAGER_NAV = [
    { label: 'แดชบอร์ด', href: '/team-manager', icon: 'LayoutDashboard' },
    { label: 'นักกีฬา', href: '/team-manager/athletes', icon: 'Users' },
    { label: 'ลงทะเบียนแข่ง', href: '/team-manager/register', icon: 'ClipboardList' },
    { label: 'ผลการแข่งขัน', href: '/team-manager/results', icon: 'Trophy' },
    { label: 'สถิติโหวต', href: '/team-manager/voting-stats', icon: 'BarChart' },
]

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Real-time
export const LEADERBOARD_REFRESH_INTERVAL = 5000 // 5 seconds
export const VOTE_STATS_REFRESH_INTERVAL = 5000 // 5 seconds
