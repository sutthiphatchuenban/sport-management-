'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { TeamScoreCard } from '@/components/shared/team-score-card'
import { ScoreBarChart } from '@/components/shared/score-bar-chart'
import { LeaderboardChart } from '@/components/shared/leaderboard-chart'
import { StatsCard } from '@/components/shared/stats-card'
import { Trophy, Medal, Flag, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

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
}

export default function LeaderboardPage() {
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState<any[]>([])

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/leaderboard')
            const data = await res.json()
            setTeams(data)
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        }
    }

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/leaderboard/history')
            const data = await res.json()
            setHistory(data.history)
        } catch (error) {
            console.error('Failed to fetch history:', error)
        }
    }

    useEffect(() => {
        fetchLeaderboard().then(() => setLoading(false))
        fetchHistory()

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

            {/* Detailed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <TeamScoreCard
                        key={team.id}
                        name={team.name}
                        score={team.totalScore}
                        rank={team.rank}
                        hexCode={team.hexCode}
                    />
                ))}
            </div>
        </div>
    )
}
