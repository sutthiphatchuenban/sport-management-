'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Settings,
    Trophy,
    Palette,
    GraduationCap,
    Dribbble,
    ScrollText,
    Vote,
    History,
    ChevronRight,
    Menu,
    X,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

const navItems = [
    { label: 'แดชบอร์ด', href: '/admin', icon: LayoutDashboard },
    { label: 'จัดการผู้ใช้งาน', href: '/admin/users', icon: Users },
    { type: 'divider', label: 'ข้อมูลพื้นฐาน' },
    { label: 'สาขาวิชา', href: '/admin/majors', icon: GraduationCap },
    { label: 'สีประจำทีม', href: '/admin/colors', icon: Palette },
    { label: 'ประเภทกีฬา', href: '/admin/sport-types', icon: Dribbble },
    { label: 'เกณฑ์การให้คะแนน', href: '/admin/scoring-rules', icon: ScrollText },
    { type: 'divider', label: 'รางวัลและโหวต' },
    { label: 'จัดการรางวัล', href: '/admin/awards', icon: Trophy },
    { label: 'ตั้งค่าการโหวต', href: '/admin/vote-settings', icon: Vote },
    { type: 'divider', label: 'ระบบ' },
    { label: 'ประวัติการใช้งาน', href: '/admin/logs', icon: History },
    { label: 'จอแสดงผลสนาม (TV)', href: '/tv', icon: LayoutDashboard },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-glow"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X /> : <Menu />}
            </Button>

            {/* Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed top-0 left-0 h-full z-40 bg-background/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300",
                mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                collapsed ? "w-20" : "w-72"
            )}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 px-2 mb-8 h-12">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-glow">
                            <Settings className="h-6 w-6" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-black tracking-tighter text-lg leading-none">IT SPORT</span>
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Admin Panel</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                        {navItems.map((item, idx) => {
                            if (item.type === 'divider') {
                                return !collapsed ? (
                                    <div key={idx} className="px-3 pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                        {item.label}
                                    </div>
                                ) : <div key={idx} className="h-px bg-white/5 my-4" />
                            }

                            const Icon = item.icon!
                            const active = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                        active
                                            ? "bg-primary text-white shadow-glow-sm"
                                            : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", active ? "scale-110" : "group-hover:scale-110")} />
                                    {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
                                    {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive group"
                            onClick={() => signOut({ callbackUrl: '/login' })}
                        >
                            <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            {!collapsed && <span className="text-sm font-bold">ออกจากระบบ</span>}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}
