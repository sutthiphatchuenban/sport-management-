'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Trophy, LogIn, LogOut, User, ChevronDown, Award, Calendar, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { APP_NAME, ROLE_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'

const publicNavLinks = [
    { href: '/leaderboard', label: 'คะแนนรวม', icon: Award },
    { href: '/results', label: 'ผลการแข่งขัน', icon: Trophy },
    { href: '/schedule', label: 'ตารางแข่ง', icon: Calendar },
    { href: '/athletes', label: 'นักกีฬา', icon: Users },
    { href: '/awards', label: 'รางวัล', icon: Award },
]

export function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const user = session?.user

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const getDashboardLink = () => {
        if (!user?.role) return null
        switch (user.role) {
            case 'ADMIN': return '/admin'
            case 'ORGANIZER': return '/organizer'
            case 'TEAM_MANAGER': return '/team-manager'
            default: return null
        }
    }

    const dashboardLink = getDashboardLink()

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isScrolled
                ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
                : "bg-transparent"
        )}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 md:h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow group-hover:rotate-12 transition-transform">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col gap-0 leading-none">
                            <span className="text-xl font-black tracking-tighter text-gradient">
                                IT SPORT
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Management
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 xl:gap-2 md:flex">
                        {publicNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'relative px-4 py-2 text-sm font-semibold transition-all hover:text-primary group',
                                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                                )}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary/40 rounded-full transition-all group-hover:w-4" />
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu / Login */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 rounded-full border bg-muted/50 p-1 pr-3 transition-colors hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden text-sm font-semibold sm:block">{user.username}</span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 z-50 mt-3 w-64 glass-dark rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95">
                                            <div className="px-4 py-3 border-b border-white/10 mb-2">
                                                <p className="font-bold text-white">{user.username}</p>
                                                <p className="text-xs text-white/50">{ROLE_LABELS[user.role]}</p>
                                            </div>
                                            {dashboardLink && (
                                                <Link
                                                    href={dashboardLink}
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl transition-colors"
                                                >
                                                    <User className="h-4 w-4" />
                                                    ไปยังแดชบอร์ด
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                ออกจากระบบ
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Button asChild className="rounded-full px-6 font-bold shadow-glow" size="sm">
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    เข้าสู่ระบบ
                                </Link>
                            </Button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted md:hidden"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-x-0 top-[64px] z-40 border-b bg-background p-4 animate-in slide-in-from-top md:hidden">
                        <nav className="grid gap-2">
                            {publicNavLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors',
                                        pathname === link.href
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted'
                                    )}
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
