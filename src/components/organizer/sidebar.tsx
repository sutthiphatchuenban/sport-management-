'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Trophy,
    Calendar,
    Vote,
    BarChart3,
    ChevronRight,
    Menu,
    X,
    LogOut,
    Award,
    Clock,
    Medal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

const navItems = [
    { label: 'แดชบอร์ด', href: '/organizer', icon: LayoutDashboard },
    { type: 'divider', label: 'จัดการการแข่งขัน' },
    { label: 'รายการแข่งขัน', href: '/organizer/events', icon: Trophy },
    { label: 'ตารางสรุปผล', href: '/organizer/schedule', icon: Calendar },
    { type: 'divider', label: 'ระบบโหวตและรางวัล' },
    { label: 'จัดการการโหวต', href: '/organizer/voting', icon: Vote },
    { label: 'ประกาศรางวัล', href: '/organizer/awards/announce', icon: Medal },
    { type: 'divider', label: 'รายงาน' },
    { label: 'สถิติและรายงาน', href: '/organizer/reports', icon: BarChart3 },
    { type: 'divider', label: 'อื่นๆ' },
    { label: 'จอแสดงผลสนาม (TV)', href: '/tv', icon: LayoutDashboard },
]

export function OrganizerSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-emerald-600 text-white shadow-glow"
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
                "fixed top-0 left-0 h-full z-40 bg-[#020617]/80 backdrop-blur-xl border-r border-white/5 transition-all duration-300",
                mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                collapsed ? "w-20" : "w-72"
            )}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 px-2 mb-8 h-12">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Clock className="h-6 w-6" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-black tracking-tighter text-lg leading-none">IT SPORT</span>
                                <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">Organizer Console</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                        {navItems.map((item, idx) => {
                            if (item.type === 'divider') {
                                return !collapsed ? (
                                    <div key={idx} className="px-3 pt-6 pb-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/50">
                                        {item.label}
                                    </div>
                                ) : <div key={idx} className="h-px bg-white/5 my-4" />
                            }

                            const Icon = item.icon!
                            const active = pathname === item.href || pathname.startsWith(item.href + '/')

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                                        active
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "hover:bg-white/5 text-slate-400 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
                                    {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
                                    {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4" />}

                                    {active && (
                                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 group transition-colors"
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
