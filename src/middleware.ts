import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const { pathname } = nextUrl

    // Routes accessible only by specific roles
    const roleRoutes: Record<string, string[]> = {
        '/admin': ['ADMIN'],
        '/organizer': ['ADMIN', 'ORGANIZER'],
        '/team-manager': ['ADMIN', 'TEAM_MANAGER'],
    }

    // Check role-based access
    if (isLoggedIn && req.auth?.user) {
        for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
            if (pathname.startsWith(route)) {
                if (!allowedRoles.includes(req.auth.user.role as string)) {
                    // Redirect to appropriate dashboard based on role or home
                    let redirectPath = '/'
                    const userRole = req.auth.user.role as string

                    if (userRole === 'ADMIN') redirectPath = '/admin'
                    else if (userRole === 'ORGANIZER') redirectPath = '/organizer'
                    else if (userRole === 'TEAM_MANAGER') redirectPath = '/team-manager'

                    return NextResponse.redirect(new URL(redirectPath, nextUrl))
                }
            }
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
