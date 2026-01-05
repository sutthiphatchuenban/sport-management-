'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    BarChart3,
    Trophy,
    Medal,
    Users,
    TrendingUp,
    Download,
    PieChart as PieChartIcon,
    Award,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts'
import { toast } from 'sonner'

export default function OrganizerReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/organizer/reports')
                const json = await res.json()
                setData(json)
            } catch (error) {
                toast.error('ไม่สามารถดึงข้อมูลรายงานได้')
            } finally {
                setLoading(false)
            }
        }
        fetchReports()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
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

    const standingsData = data.colorStandings.map((c: any) => ({
        name: c.name,
        points: c.totalPoints,
        color: c.hexCode,
        gold: c.gold,
        silver: c.silver,
        bronze: c.bronze
    }))

    const medalsData = data.colorStandings.map((c: any) => ({
        name: c.name,
        value: c.gold + c.silver + c.bronze,
        color: c.hexCode
    }))

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="สถิติและรายงานสรุปผล"
                    description="วิเคราะห์ภาพรวมการแข่งขัน คะแนนสะสมแต่ละสี และสถิตินักกีฬาแบบ Real-time"
                />
                <Button variant="outline" className="rounded-xl glass border-white/10 h-12 px-6 font-bold shadow-glow hover:bg-emerald-500/10">
                    <Download className="mr-2 h-4 w-4" />
                    ส่งออกรายงาน (PDF)
                </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'คะแนนรวมสูงสุด', value: standingsData[0]?.points || 0, sub: `สี${standingsData[0]?.name}`, icon: Trophy, color: 'text-amber-500' },
                    { label: 'ยอดลงทะเบียนรวม', value: data.summary.totalRegistrations, sub: 'ทุกรายการแข่งขัน', icon: Users, color: 'text-emerald-500' },
                    { label: 'นักกีฬาที่ร่วมแข่ง', value: data.summary.uniqueAthletes, sub: 'จำนวนรายคน', icon: Activity, color: 'text-blue-500' },
                    { label: 'รายการทั้งหมด', value: data.summary.totalEvents, sub: 'Upcoming / Finished', icon: Award, color: 'text-pink-500' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                    <h3 className="text-3xl font-black">{stat.value.toLocaleString()}</h3>
                                    <p className="text-[10px] font-bold opacity-40 uppercase">{stat.sub}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Points Bar Chart */}
                <Card className="glass border-none rounded-3xl overflow-hidden min-h-[450px]">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                            สรุปคะแนนรวมตามสีทีม
                        </CardTitle>
                        <CardDescription>กราฟเปรียบเทียบคะแนนสะสมจากการแข่งขันทุกประเภท</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={standingsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="points" radius={[8, 8, 0, 0]} barSize={40}>
                                        {standingsData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Medals Distribution */}
                <Card className="glass border-none rounded-3xl overflow-hidden self-start">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Medal className="h-5 w-5 text-amber-500" />
                            ตารางเหรียญรางวัลรวม
                        </CardTitle>
                        <CardDescription>สถิติเหรียญ ทอง เงิน และทองแดง ของแต่ละสี</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {standingsData.map((c: any, i: number) => (
                                <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-lg border border-white/10" style={{ color: c.color }}>
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold">สี{c.name}</span>
                                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{c.points} PTS</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-1">
                                                <div className="h-3 w-3 rounded-full bg-amber-500" />
                                            </div>
                                            <span className="text-xs font-black">{c.gold}</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="h-6 w-6 rounded-full bg-slate-300/10 flex items-center justify-center mx-auto mb-1">
                                                <div className="h-3 w-3 rounded-full bg-slate-300" />
                                            </div>
                                            <span className="text-xs font-black">{c.silver}</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="h-6 w-6 rounded-full bg-amber-800/10 flex items-center justify-center mx-auto mb-1">
                                                <div className="h-3 w-3 rounded-full bg-amber-800" />
                                            </div>
                                            <span className="text-xs font-black">{c.bronze}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Athletes Table */}
                <Card className="lg:col-span-2 glass border-none rounded-3xl overflow-hidden mb-12">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-emerald-400" />
                            TOP 10 นักกีฬาคะแนนสูงสุด (Leading MVP)
                        </CardTitle>
                        <CardDescription>นักกีฬาที่มีผลงานโดดเด่นและรวบรวมคะแนนให้สีได้มากที่สุด</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">อันดับ</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">นักกีฬา</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">สีทีม</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">คะแนนรวม</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.topAthletes.map((athlete: any, i: number) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-black opacity-40">#{i + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{athlete.firstName} {athlete.lastName}</span>
                                                    <span className="text-[10px] font-mono opacity-50 uppercase">{athlete.studentId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="border-white/10 rounded-md font-bold text-[10px]">
                                                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: athlete.color.hexCode }} />
                                                    สี{athlete.color.name}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-lg font-black text-emerald-400">{athlete.totalPoints} PTS</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.topAthletes.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground italic">ไม่มีข้อมูลนักกีฬา</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
