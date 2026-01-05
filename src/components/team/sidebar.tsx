'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    BarChart2,
    Settings,
    ChevronRight,
    Menu,
    X,
    LogOut,
    Trophy,
    UserPlus,
    Flame
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'

const navItems = [
    { label: 'แดชบอร์ดทีม', href: '/team-manager', icon: LayoutDashboard },
    { type: 'divider', label: 'จัดการนักกีฬา' },
    { label: 'รายชื่อนักกีฬา', href: '/team-manager/athletes', icon: Users },
    { label: 'เพิ่มนักกีฬาใหม่', href: '/team-manager/athletes/new', icon: UserPlus },
    { type: 'divider', label: 'การแข่งขัน' },
    { label: 'ลงทะเบียนแข่ง', href: '/team-manager/register', icon: ClipboardCheck },
    { label: 'ผลการแข่งขันทีม', href: '/team-manager/results', icon: Trophy },
    { type: 'divider', label: 'สรุปข้อมูล' },
    { label: 'สถิติการโหวตทีม', href: '/team-manager/voting-stats', icon: BarChart2 },
]

export function TeamSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Using a subtle blue/indigo theme for team manager as default
    // or maybe it should be more vibrant?

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg"
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
                "fixed top-0 left-0 h-full z-40 bg-[#020617]/90 backdrop-blur-xl border-r border-white/5 transition-all duration-300",
                mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                collapsed ? "w-20" : "w-72"
            )}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 px-2 mb-8 h-12">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                            <Flame className="h-6 w-6" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-black tracking-tighter text-lg leading-none uppercase">Team Panel</span>
                                <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Management Suite</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                        {navItems.map((item, idx) => {
                            if (item.type === 'divider') {
                                return !collapsed ? (
                                    <div key={idx} className="px-3 pt-6 pb-2 text-[10px] font-black uppercase tracking-widest text-indigo-400/50">
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
                                            ? "bg-indigo-600/10 text-indigo-400"
                                            : "hover:bg-white/5 text-slate-400 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
                                    {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
                                    {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4" />}

                                    {active && (
                                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
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
