import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/admin') ||
                nextUrl.pathname.startsWith('/organizer') ||
                nextUrl.pathname.startsWith('/team-manager')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = (user as any).username
                token.role = (user as any).role
                token.majorId = (user as any).majorId
                token.colorId = (user as any).colorId
            }
            return token
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                session.user.id = token.id
                session.user.username = token.username
                session.user.role = token.role
                session.user.majorId = token.majorId
                session.user.colorId = token.colorId
            }
            return session
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
