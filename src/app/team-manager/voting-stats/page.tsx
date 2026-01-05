'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Vote,
    BarChart3,
    TrendingUp,
    Users,
    BarChart2,
    Trophy,
    Heart,
    Star,
    Award
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
import { useSession } from 'next-auth/react'

export default function TeamVotingStatsPage() {
    const { data: session } = useSession()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/team-manager/voting')
                const json = await res.json()
                setData(json)
            } catch (error) {
                console.error('Failed to fetch voting stats:', error)
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] rounded-3xl" />
                    <Skeleton className="h-[400px] rounded-3xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="สถิติความนิยม (โหวต)"
                description="ติดตามคะแนนความนิยมของนักกีฬาในทีมผ่านผลโหวต Popular Vote"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'คะแนนโหวตรวมของทีม', value: data.summary.totalTeamVotes.toLocaleString(), icon: Heart, color: 'text-rose-500' },
                    { label: 'นักกีฬาที่โดดเด่นที่สุด', value: data.topAthletes[0]?.name || '-', icon: Star, color: 'text-amber-500' },
                    { label: 'รายการที่มีการโหวตสูงสุด', value: data.eventStats[0]?.name || '-', icon: Trophy, color: 'text-indigo-500' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none rounded-3xl overflow-hidden">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <h3 className="text-xl md:text-2xl font-black truncate max-w-[200px]">{stat.value}</h3>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Athletes Chart */}
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Award className="h-5 w-5 text-indigo-400" />
                            Leaderboard - ขวัญใจทีม
                        </CardTitle>
                        <CardDescription>นักกีฬา 10 อันดับแรกที่มีคะแนนโหวตสูงสุดในสีของคุณ</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={data.topAthletes} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="voteCount" radius={[0, 8, 8, 0]} barSize={20}>
                                        {data.topAthletes.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : 'rgba(79, 70, 229, 0.4)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Vote Distribution list */}
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-rose-500" />
                            การโหวตแยกตามรายการ
                        </CardTitle>
                        <CardDescription>ความเคลื่อนไหวการโหวตในแต่ละประเภทกีฬา</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {data.eventStats.map((event: any, i: number) => (
                                <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-muted-foreground border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{event.name}</span>
                                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{event.sportType}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-black text-rose-500">{event.count}</span>
                                        <span className="text-[10px] font-bold opacity-30 mt-[-4px]">VOTES</span>
                                    </div>
                                </div>
                            ))}
                            {data.eventStats.length === 0 && (
                                <div className="text-center py-20 text-muted-foreground italic text-sm">ยังไม่มีข้อมูลการโหวต</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
