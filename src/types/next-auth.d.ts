import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            username: string
            role: string
            majorId?: string
            colorId?: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        username: string
        role: string
        majorId?: string | null
        colorId?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        username: string
        role: string
        majorId?: string | null
        colorId?: string | null
    }
}
