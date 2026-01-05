'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { TeamScoreCard } from '@/components/shared/team-score-card'
import { ScoreBarChart } from '@/components/shared/score-bar-chart'
import { LeaderboardChart } from '@/components/shared/leaderboard-chart'
import { StatsCard } from '@/components/shared/stats-card'
import { Trophy, Medal, Flag, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'

interface BreakdownItem {
    eventName: string
    sportName: string
    rank: number
    points: number
}

interface Team {
    id: string
    name: string
    hexCode: string
    totalScore: number
    rank: number
    goldMedals: number
    _count: {
        majors: number
        athletes: number
    }
    breakdown: BreakdownItem[]
}

export default function LeaderboardPage() {
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/leaderboard')
            const data = await res.json()
            setTeams(data)
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        }
    }

    useEffect(() => {
        fetchLeaderboard().then(() => setLoading(false))

        // Polling every 15 seconds
        const interval = setInterval(() => {
            fetchLeaderboard()
        }, 15000)

        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    const topTeam = teams[0]

    return (
        <div className="container mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700">
            <PageHeader
                title="กระดานคะแนนรวม (Leaderboard)"
                description="สรุปคะแนนการแข่งขันและอันดับของทุกสีแบบเรียลไทม์"
            />

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                    label="สีที่นำอยู่ขณะนี้"
                    value={topTeam ? `สี${topTeam.name}` : '-'}
                    icon={Trophy}
                    description={`คะแนนปัจจุบัน: ${topTeam?.totalScore || 0}`}
                />
                <StatsCard
                    label="จ้าวเหรียญทอง"
                    value={topTeam ? `สี${topTeam.name}` : '-'}
                    icon={Medal}
                    description={`จำนวน ${topTeam?.goldMedals || 0} รายการ`}
                />
                <StatsCard
                    label="จำนวนทีมทั้งหมด"
                    value={teams.length}
                    icon={Flag}
                />
                <StatsCard
                    label="จำนวนนักกีฬาที่เข้าร่วม"
                    value={teams.reduce((acc, curr) => acc + curr._count.athletes, 0)}
                    icon={Users}
                />
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ScoreBarChart
                        data={teams.map(t => ({ name: t.name, score: t.totalScore, hexCode: t.hexCode }))}
                    />
                </div>
                <div className="lg:col-span-1">
                    <LeaderboardChart
                        data={teams.map(t => ({ id: t.id, name: t.name, score: t.totalScore, hexCode: t.hexCode }))}
                    />
                </div>
            </div>

            {/* Detailed Table with Breakdown */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Medal className="h-5 w-5 text-amber-500" />
                    รายละเอียดคะแนนแยกตามสี
                </h3>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
                    {teams.map((team, index) => (
                        <div key={team.id} className="border-b border-white/5 last:border-none">
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold
                                        ${index === 0 ? 'bg-amber-500 text-black shadow-glow' :
                                            index === 1 ? 'bg-slate-300 text-black' :
                                                index === 2 ? 'bg-amber-700 text-white' : 'bg-white/10'}
                                    `}>
                                        {team.rank}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full border"
                                            style={{ backgroundColor: team.hexCode, borderColor: team.hexCode }}
                                        />
                                        <span className="font-bold text-lg">สี{team.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <span className="block text-2xl font-black tabular-nums">{team.totalScore}</span>
                                        <span className="text-xs text-muted-foreground uppercase">คะแนนรวม</span>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        {expandedTeam === team.id ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                </div>
                            </div>

                            {/* Expanded Content: Breakdown */}
                            {expandedTeam === team.id && (
                                <div className="p-4 bg-black/20 animate-in slide-in-from-top-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                <TableHead>รายการแข่งขัน</TableHead>
                                                <TableHead>ประเภทกีฬา</TableHead>
                                                <TableHead>อันดับที่ได้</TableHead>
                                                <TableHead className="text-right">คะแนนที่ได้</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {team.breakdown.length > 0 ? (
                                                team.breakdown.map((item, idx) => (
                                                    <TableRow key={idx} className="border-white/10 hover:bg-white/5">
                                                        <TableCell>{item.eventName}</TableCell>
                                                        <TableCell>{item.sportName}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="bg-white/10">
                                                                อันดับ {item.rank}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-green-400">
                                                            +{item.points}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                        ยังไม่มีรายการแข่งขันที่ได้คะแนน
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
