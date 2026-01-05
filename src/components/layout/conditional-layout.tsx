'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Check if the current path is an admin or organizer dashboard
    const isDashboard = pathname.startsWith('/admin') ||
        pathname.startsWith('/organizer') ||
        pathname.startsWith('/team-manager') ||
        pathname.startsWith('/tv')

    if (isDashboard) {
        return <>{children}</>
    }

    return (
        <>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    )
}
