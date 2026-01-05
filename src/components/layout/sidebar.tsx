'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Trophy,
    Calendar,
    Settings,
    FileText,
    Award,
    ChevronLeft,
    LogOut,
    Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role: 'ADMIN' | 'ORGANIZER' | 'TEAM_MANAGER'
}

export function Sidebar({ className, role }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const adminLinks = [
        { href: '/admin', icon: LayoutDashboard, label: 'แดชบอร์ด' },
        { href: '/admin/users', icon: Users, label: 'ผู้ใช้งาน' },
        { href: '/admin/majors', icon: FileText, label: 'สาขา' },
        { href: '/admin/colors', icon: Trophy, label: 'สี/ทีม' },
        { href: '/admin/sport-types', icon: Calendar, label: 'ประเภทกีฬา' },
        { href: '/admin/awards', icon: Award, label: 'รางวัล' },
        { href: '/admin/settings', icon: Settings, label: 'ตั้งค่าระบบ' },
    ]

    const organizerLinks = [
        { href: '/organizer', icon: LayoutDashboard, label: 'แดชบอร์ด' },
        { href: '/organizer/events', icon: Trophy, label: 'การแข่งขัน' },
        { href: '/organizer/schedule', icon: Calendar, label: 'ตารางแข่งขัน' },
        { href: '/organizer/results', icon: FileText, label: 'บันทึกผล' },
        { href: '/organizer/voting', icon: Users, label: 'จัดการโหวต' },
    ]

    const managerLinks = [
        { href: '/team-manager', icon: LayoutDashboard, label: 'ทีมของฉัน' },
        { href: '/team-manager/athletes', icon: Users, label: 'นักกีฬา' },
        { href: '/team-manager/register', icon: ChevronLeft, label: 'ลงทะเบียนแข่ง' },
        { href: '/team-manager/results', icon: FileText, label: 'ผลการแข่งขัน' },
    ]

    const links = role === 'ADMIN' ? adminLinks : role === 'ORGANIZER' ? organizerLinks : managerLinks

    return (
        <div className={cn(
            "relative flex flex-col border-r border-white/10 bg-background/50 backdrop-blur-xl transition-all duration-300",
            isCollapsed ? "w-20" : "w-64",
            className
        )}>
            {/* Collapse Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-20 z-20 h-6 w-6 rounded-full border border-white/10 bg-background shadow-md hidden lg:flex"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            </Button>

            {/* Sidebar Header */}
            <div className="flex h-16 items-center px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
                        <Trophy className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-lg font-black tracking-tighter text-gradient">
                            Management
                        </span>
                    )}
                </Link>
            </div>

            <ScrollArea className="flex-1 px-4">
                <nav className="flex flex-col gap-2 py-4">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary",
                                    isActive ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <Icon className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
                                {!isCollapsed && <span>{link.label}</span>}
                                {isActive && !isCollapsed && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className="border-t border-white/5 p-4">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>ออกจากระบบ</span>}
                </Button>
            </div>
        </div>
    )
}
