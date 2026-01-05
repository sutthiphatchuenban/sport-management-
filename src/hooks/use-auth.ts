'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Role } from '@/types'

export function useAuth() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated'
    const user = session?.user

    const login = async (username: string, password: string) => {
        const result = await signIn('credentials', {
            username,
            password,
            redirect: false,
        })

        if (result?.error) {
            throw new Error(result.error)
        }

        return result
    }

    const logout = async () => {
        await signOut({ redirect: false })
        router.push('/login')
    }

    const hasRole = (roles: Role | Role[]): boolean => {
        if (!user?.role) return false
        const roleArray = Array.isArray(roles) ? roles : [roles]
        return roleArray.includes(user.role as Role)
    }

    const isAdmin = hasRole('ADMIN')
    const isOrganizer = hasRole(['ADMIN', 'ORGANIZER'])
    const isTeamManager = hasRole(['ADMIN', 'TEAM_MANAGER'])

    const getRedirectPath = (): string => {
        if (!user?.role) return '/'
        switch (user.role) {
            case 'ADMIN':
                return '/admin'
            case 'ORGANIZER':
                return '/organizer'
            case 'TEAM_MANAGER':
                return '/team-manager'
            default:
                return '/'
        }
    }

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        hasRole,
        isAdmin,
        isOrganizer,
        isTeamManager,
        getRedirectPath,
    }
}
