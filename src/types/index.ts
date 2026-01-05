// Type Definitions

export type Role = 'ADMIN' | 'ORGANIZER' | 'TEAM_MANAGER' | 'VIEWER'
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
export type SportCategory = 'INDIVIDUAL' | 'TEAM'
export type RegistrationStatus = 'REGISTERED' | 'CONFIRMED' | 'DISQUALIFIED'
export type AnnouncementType = 'GENERAL' | 'URGENT' | 'RESULT'
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
export type AwardType = 'OVERALL' | 'CATEGORY' | 'SPECIAL'

// User
export interface User {
    id: string
    username: string
    email: string
    role: Role
    majorId?: string
    colorId?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    major?: Major
    color?: Color
}

// Major
export interface Major {
    id: string
    name: string
    code: string
    colorId?: string
    color?: Color
}

// Color (Team)
export interface Color {
    id: string
    name: string
    hexCode: string
    totalScore: number
}

// Sport Type
export interface SportType {
    id: string
    name: string
    category: SportCategory
    maxParticipants?: number
    description?: string
}

// Event
export interface Event {
    id: string
    sportTypeId: string
    name: string
    date: Date
    time: string
    location?: string
    status: EventStatus
    createdById?: string
    sportType?: SportType
    registrations?: EventRegistration[]
    results?: EventResult[]
}

// Athlete
export interface Athlete {
    id: string
    studentId: string
    firstName: string
    lastName: string
    nickname?: string
    majorId: string
    colorId: string
    photoUrl?: string
    major?: Major
    color?: Color
}

// Event Registration
export interface EventRegistration {
    id: string
    eventId: string
    athleteId: string
    colorId: string
    status: RegistrationStatus
    event?: Event
    athlete?: Athlete
    color?: Color
}

// Event Result
export interface EventResult {
    id: string
    eventId: string
    colorId: string
    athleteId?: string
    rank: number
    points: number
    notes?: string
    color?: Color
    athlete?: Athlete
}

// Vote
export interface Vote {
    id: string
    eventId: string
    athleteId: string
    voterIp?: string
    voterUserId?: string
    votedAt: Date
    athlete?: Athlete
}

// Vote Summary
export interface VoteSummary {
    athleteId: string
    athleteName: string
    colorId: string
    colorName: string
    votes: number
    rank: number
}

// Award
export interface Award {
    id: string
    name: string
    description?: string
    awardType: AwardType
    category?: string
    prizeDetails?: string
    imageUrl?: string
}

// Leaderboard Entry
export interface LeaderboardEntry {
    id: string
    name: string
    hexCode: string
    totalScore: number
    rank: number
}

// API Response
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
    }
    message?: string
}

// Paginated Response
export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
