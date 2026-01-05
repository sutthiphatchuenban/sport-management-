'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Trophy,
    Users,
    ClipboardCheck,
    Calendar,
    ChevronRight,
    Medal,
    Clock,
    Flame,
    TrendingUp,
    MapPin,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function TeamManagerDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/team-manager/stats')
                const json = await res.json()
                setData(json)
            } catch (error) {
                console.error('Failed to fetch team stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <Skeleton className="h-16 w-1/3 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            </div>
        )
    }

    const stats = [
        { label: 'คะแนนรวมทีม', value: data.stats.totalScore, icon: Trophy, color: 'text-amber-500', sub: 'Ranking Points' },
        { label: 'นักกีฬาในสังกัด', value: data.stats.athleteCount, icon: Users, color: 'text-indigo-500', sub: 'Registered Athletes' },
        { label: 'รายการที่ลงแข่ง', value: data.stats.registrationCount, icon: ClipboardCheck, color: 'text-emerald-500', sub: 'Total Participation' },
        { label: 'รอการแข่งขัน', value: data.stats.upcomingEvents, icon: Clock, color: 'text-blue-500', sub: 'Upcoming Events' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title={`แดชบอร์ดทีม${data.teamInfo.name}`}
                description="จัดการรายชื่อนักกีฬา ลงทะเบียนการแข่งขัน และติดตามผลคะแนนของทีม"
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="glass border-none rounded-3xl overflow-hidden hover:scale-[1.02] transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                    <h3 className="text-3xl font-black">{stat.value.toLocaleString()}</h3>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{stat.sub}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Team Results */}
                <Card className="lg:col-span-2 glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-400" />
                                ผลการแข่งขันล่าสุดของทีม
                            </CardTitle>
                            <CardDescription>ประวัติการคว้าชัยชนะและคะแนนที่ได้รับล่าสุด</CardDescription>
                        </div>
                        <Button variant="ghost" asChild className="rounded-xl font-bold">
                            <Link href="/team-manager/results">ดูทั้งหมด <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            {data.recentResults.map((result: any) => (
                                <div key={result.id} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/20 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg",
                                            result.rank === 1 ? "bg-amber-500/20 text-amber-500" :
                                                result.rank === 2 ? "bg-slate-300/20 text-slate-300" :
                                                    result.rank === 3 ? "bg-amber-800/20 text-amber-800" :
                                                        "bg-white/5 text-muted-foreground"
                                        )}>
                                            {result.rank}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm uppercase leading-tight group-hover:text-indigo-400 transition-colors">{result.event.name}</h4>
                                            <div className="flex items-center gap-2 text-[10px] uppercase font-black opacity-30 tracking-widest mt-1">
                                                <span>{result.event.sportType.name}</span>
                                                {result.athlete && (
                                                    <>
                                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                                        <span className="text-indigo-400">{result.athlete.firstName} ({result.athlete.nickname})</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <span className="text-lg font-black text-emerald-400">+{result.points}</span>
                                            <span className="text-[10px] font-bold opacity-30 mt-0.5">PTS</span>
                                        </div>
                                        <p className="text-[10px] font-medium opacity-30 leading-none">{format(new Date(result.recordedAt), 'dd MMM HH:mm', { locale: th })}</p>
                                    </div>
                                </div>
                            ))}
                            {data.recentResults.length === 0 && (
                                <div className="text-center py-20 text-muted-foreground italic text-sm">ยังไม่มีผลการแข่งขัน</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Schedule */}
                <div className="space-y-8">
                    <Card className="glass border-none rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white/5 border-b border-white/5">
                            <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter">
                                <Calendar className="h-5 w-5 text-indigo-400" />
                                ตารางแข่งถัดไป
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {data.upcomingEvents.map((event: any) => (
                                    <div key={event.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-white/10">
                                        <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{event.time} น.</p>
                                                <Badge variant="outline" className="text-[8px] h-4 border-white/10 opacity-50 px-1 font-black">
                                                    {event._count.registrations} นักกีฬา
                                                </Badge>
                                            </div>
                                            <h5 className="font-bold text-sm leading-tight">{event.name}</h5>
                                            <div className="flex items-center gap-2 text-[10px] font-medium opacity-30">
                                                <MapPin className="h-3 w-3" />
                                                {event.location || 'ไม่ได้ระบุสนาม'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.upcomingEvents.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground italic text-xs">ไม่มีรายการแข่งเร็วๆ นี้</div>
                                )}
                            </div>
                            <Button variant="outline" className="w-full mt-6 rounded-xl glass border-white/10 font-bold h-11" asChild>
                                <Link href="/team-manager/register">ลงทะเบียนนักกีฬาเพิ่ม</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-indigo-600 rounded-3xl overflow-hidden border-none text-white shadow-[0_20px_40px_rgba(79,70,229,0.2)]">
                        <CardContent className="p-8 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Flame className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black">เตรียมความพร้อม!</h4>
                                <p className="text-sm opacity-80 mt-1 leading-relaxed">ตรวจสอบรายการถัดไปและยืนยันตัวนักกีฬาให้พร้อมก่อนเวลาการแข่งขัน 15 นาที</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
