import { z } from 'zod'

// ============ AUTH ============

export const loginSchema = z.object({
    username: z.string().min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

export const registerSchema = z.object({
    username: z.string().min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
})

// ============ USER ============

export const createUserSchema = z.object({
    username: z.string().min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    role: z.enum(['ADMIN', 'ORGANIZER', 'TEAM_MANAGER', 'VIEWER']),
    majorId: z.string().optional(),
    colorId: z.string().optional(),
})

export const updateUserSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['ADMIN', 'ORGANIZER', 'TEAM_MANAGER', 'VIEWER']).optional(),
    majorId: z.string().nullable().optional(),
    colorId: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
})

// ============ MAJOR ============

export const majorSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อสาขา'),
    code: z.string().min(1, 'กรุณากรอกรหัสสาขา').max(10, 'รหัสสาขาต้องไม่เกิน 10 ตัวอักษร'),
    colorId: z.string().optional(),
})

// ============ COLOR ============

export const colorSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อสี'),
    hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'รูปแบบสีไม่ถูกต้อง'),
})

// ============ SPORT TYPE ============

export const sportTypeSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อประเภทกีฬา'),
    category: z.enum(['INDIVIDUAL', 'TEAM']),
    maxParticipants: z.number().positive().optional(),
    description: z.string().optional(),
})

// ============ EVENT ============

export const eventSchema = z.object({
    sportTypeId: z.string().min(1, 'กรุณาเลือกประเภทกีฬา'),
    name: z.string().min(1, 'กรุณากรอกชื่อรายการแข่งขัน'),
    date: z.string().min(1, 'กรุณาเลือกวันที่'),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'รูปแบบเวลาไม่ถูกต้อง'),
    location: z.string().optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
})

export const eventResultSchema = z.object({
    results: z.array(z.object({
        colorId: z.string().min(1),
        athleteId: z.string().optional(),
        rank: z.number().positive(),
        points: z.number().min(0),
        notes: z.string().optional(),
    })),
    reason: z.string().optional(), // Required for updates
})

// ============ ATHLETE ============

export const athleteSchema = z.object({
    studentId: z.string().min(1, 'กรุณากรอกรหัสนิสิต'),
    firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
    nickname: z.string().optional(),
    majorId: z.string().min(1, 'กรุณาเลือกสาขา'),
    colorId: z.string().min(1, 'กรุณาเลือกสี'),
    photoUrl: z.string().url().optional().or(z.literal('')),
})

// ============ REGISTRATION ============

export const registrationSchema = z.object({
    athleteIds: z.array(z.string()).min(1, 'กรุณาเลือกนักกีฬาอย่างน้อย 1 คน'),
})

// ============ VOTE ============

export const voteSchema = z.object({
    athleteId: z.string().min(1, 'กรุณาเลือกนักกีฬา'),
    reason: z.string().optional(),
})

export const voteSettingsSchema = z.object({
    votingEnabled: z.boolean(),
    votingStart: z.string().optional(),
    votingEnd: z.string().optional(),
    maxVotesPerUser: z.number().positive(),
    showRealtimeResults: z.boolean(),
})

// ============ SCORING RULES ============

export const scoringRulesSchema = z.object({
    rules: z.array(z.object({
        rank: z.number().positive(),
        points: z.number().min(0),
    })),
})

// ============ AWARD ============

export const awardSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อรางวัล'),
    description: z.string().optional(),
    awardType: z.enum(['OVERALL', 'CATEGORY', 'SPECIAL']),
    category: z.string().optional(),
    prizeDetails: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
})

export const awardWinnerSchema = z.object({
    winners: z.array(z.object({
        awardId: z.string().min(1),
        athleteId: z.string().min(1),
        rank: z.number().positive().optional(),
    })),
})

// ============ ANNOUNCEMENT ============

export const announcementSchema = z.object({
    title: z.string().min(1, 'กรุณากรอกหัวข้อประกาศ'),
    content: z.string().min(1, 'กรุณากรอกเนื้อหาประกาศ'),
    type: z.enum(['GENERAL', 'URGENT', 'RESULT']).default('GENERAL'),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('อีเมลไม่ถูกต้อง'),
})

// ============ TYPE EXPORTS ============

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type MajorInput = z.infer<typeof majorSchema>
export type ColorInput = z.infer<typeof colorSchema>
export type SportTypeInput = z.infer<typeof sportTypeSchema>
export type EventInput = z.infer<typeof eventSchema>
export type EventResultInput = z.infer<typeof eventResultSchema>
export type AthleteInput = z.infer<typeof athleteSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type VoteInput = z.infer<typeof voteSchema>
export type VoteSettingsInput = z.infer<typeof voteSettingsSchema>
export type ScoringRulesInput = z.infer<typeof scoringRulesSchema>
export type AwardInput = z.infer<typeof awardSchema>
export type AwardWinnerInput = z.infer<typeof awardWinnerSchema>
export type AnnouncementInput = z.infer<typeof announcementSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
