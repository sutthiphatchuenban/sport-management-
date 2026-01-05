'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatsCard } from '@/components/shared/stats-card'
import {
    Trophy,
    Calendar,
    Vote,
    CheckCircle2,
    Clock,
    Medal,
    Users,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function OrganizerDashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/organizer/stats')
                const json = await res.json()
                setData(json)
            } catch (error) {
                console.error('Failed to fetch organizer stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-20 w-1/3 rounded-3xl" />
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

    const stats = [
        { label: 'รายการทั้งหมด', value: data.stats.totalEvents, icon: Trophy, color: 'text-emerald-500' },
        { label: 'แข่งวันนี้', value: data.stats.todayCount, icon: Calendar, color: 'text-amber-500' },
        { label: 'ยอดโหวตรวม', value: data.stats.totalVotes, icon: Vote, color: 'text-pink-500' },
        { label: 'เร็วๆ นี้', value: data.stats.upcomingEvents, icon: Clock, color: 'text-blue-500' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="Organizer Control Center"
                    description="จัดการรายการแข่งขัน บันทึกผล และติดตามสถานะภาพรวมของงาน"
                />
                <Button asChild className="rounded-xl shadow-glow bg-emerald-600 hover:bg-emerald-500">
                    <Link href="/organizer/events">
                        จัดการสนามแข่ง
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, idx) => (
                    <StatsCard
                        key={idx}
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                        color={item.color}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule */}
                <Card className="lg:col-span-2 glass border-none rounded-3xl overflow-hidden self-start">
                    <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black flex items-center gap-2 text-emerald-500">
                                <Calendar className="h-5 w-5" />
                                รายการแข่งขันวันนี้
                            </CardTitle>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{format(new Date(), 'dd MMMM yyyy', { locale: th })}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <Link href="/organizer/events">ดูทั้งหมด</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.todayEvents.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {data.todayEvents.map((event: any) => (
                                    <div key={event.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                        <div className="flex gap-4 items-center">
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                <Trophy className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{event.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 rounded-md">
                                                        {event.sportType.name}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
                                                        <Clock className="h-3 w-3" />
                                                        {event.time} น.
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
                                                        <Users className="h-3 w-3" />
                                                        {event._count.registrations} นักกีฬา
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" asChild className="rounded-xl shadow-glow opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/organizer/events/${event.id}`}>บันทึกผล</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                    <Calendar className="h-8 w-8 opacity-20" />
                                </div>
                                <p className="text-muted-foreground font-medium italic">ไม่มีรายการแข่งขันในวันนี้</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Results Feed */}
                <div className="space-y-6">
                    <Card className="glass border-none rounded-3xl overflow-hidden h-full">
                        <CardHeader className="bg-white/5 border-b border-white/5 pb-6">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                ผลการแข่งขันล่าสุด
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {data.recentResults.length > 0 ? (
                                    data.recentResults.map((result: any) => (
                                        <div key={result.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-white/10">
                                            <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full border-2 border-[#020617]" style={{ backgroundColor: result.color.hexCode }} />
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{result.event.name}</p>
                                                <h5 className="font-bold text-sm">สี{result.color.name} ได้อันดับที่ {result.rank}</h5>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {result.athlete ? `โดย ${result.athlete.firstName}` : 'ในรายการประเภททีม'}
                                                </p>
                                                <p className="text-[10px] font-bold text-emerald-500/60 mt-1 uppercase">+{result.points} PTS</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-xs text-muted-foreground py-10 italic">ยังไม่มีการบันทึกผล</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Latest Awards */}
                    <Card className="glass border-none rounded-3xl overflow-hidden h-full">
                        <CardHeader className="bg-white/5 border-b border-white/5 pb-6">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Medal className="h-5 w-5 text-amber-500" />
                                ประกาศรางวัลล่าสุด
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {data.latestAwards.length > 0 ? (
                                    data.latestAwards.map((award: any) => (
                                        <div key={award.id} className="flex items-center gap-4 group">
                                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform">
                                                <Medal className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate group-hover:text-amber-500 transition-colors">{award.athlete.firstName}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{award.award.name}</p>
                                            </div>
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: award.athlete.color.hexCode }} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-xs text-muted-foreground py-10 italic">ยังไม่มีการประกาศรางวัล</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
