'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatsCard } from '@/components/shared/stats-card'
import { ScoreBarChart } from '@/components/shared/score-bar-chart'
import {
    Users,
    Calendar,
    UserCircle,
    Vote as VoteIcon,
    ArrowUpRight,
    Activity,
    Plus,
    UserPlus,
    Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats')
            const data = await res.json()
            setStats(data)
        } catch (error) {
            console.error('Failed to fetch admin stats:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
                    <Skeleton className="h-[400px] rounded-3xl" />
                </div>
            </div>
        )
    }

    const summaryItems = [
        { label: 'ผู้ใช้งานทั้งหมด', value: stats.summary.users, icon: Users, color: 'blue' },
        { label: 'รายการแข่งขัน', value: stats.summary.events, icon: Calendar, color: 'purple', subValue: `${stats.summary.ongoingEvents} กำลังแข่ง` },
        { label: 'นักกีฬาทั้งหมด', value: stats.summary.athletes, icon: UserCircle, color: 'emerald' },
        { label: 'คะแนนโหวตรวม', value: stats.summary.votes, icon: VoteIcon, color: 'pink' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="ภาพรวมระบบ"
                    description="ยินดีต้อนรับสู่แผงควบคุมหลักสำหรับผู้ดูแลระบบ"
                />
                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="glass border-white/10">
                        <Link href="/admin/users/new">
                            <UserPlus className="mr-2 h-4 w-4" />
                            เพิ่มผู้ใช้
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/events/new">
                            <Plus className="mr-2 h-4 w-4" />
                            สร้างกิจกรรม
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryItems.map((item, idx) => (
                    <StatsCard
                        key={idx}
                        label={item.label}
                        value={item.value.toLocaleString()}
                        icon={item.icon}
                        description={item.subValue}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ranking Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            คะแนนรวมแต่ละสี
                        </h3>
                    </div>
                    <ScoreBarChart data={stats.teamStats} />
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        กิจกรรมล่าสุด
                    </h3>
                    <Card className="glass border-none h-[400px] flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold opacity-50 uppercase tracking-widest">Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                            {stats.recentLogs.map((log: any) => (
                                <div key={log.id} className="flex gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate">@{log.user.username}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{log.action}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 opacity-50 uppercase">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: th })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {stats.recentLogs.length === 0 && (
                                <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                                    ไม่มีรายการบันทึก
                                </div>
                            )}
                        </CardContent>
                        <div className="p-4 border-t border-white/5">
                            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest bg-white/5" asChild>
                                <Link href="/admin/logs">
                                    ดูทั้งหมด
                                    <ArrowUpRight className="ml-2 h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
