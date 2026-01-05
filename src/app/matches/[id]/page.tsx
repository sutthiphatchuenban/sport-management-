'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { Clock, MapPin, Trophy, Vote as VoteIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MatchDetailPage() {
    const params = useParams()
    const id = params.id as string

    const [match, setMatch] = useState<any>(null)
    const [voteStats, setVoteStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [voting, setVoting] = useState<string | null>(null) // athleteId being voted

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/matches/${id}`)
                const data = await res.json()
                setMatch(data)
                if (data.voteStats) setVoteStats(data.voteStats)
            } catch (error) {
                console.error('Failed to load match', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

        // Polling for vote stats if live
        const interval = setInterval(() => {
            fetch(`/api/matches/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.voteStats) setVoteStats(data.voteStats)
                })
        }, 10000)

        return () => clearInterval(interval)
    }, [id])

    const handleVote = async (athleteId: string, athleteName: string) => {
        setVoting(athleteId)
        try {
            const res = await fetch(`/api/matches/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ athleteId })
            })
            const data = await res.json()

            if (res.ok) {
                toast.success(data.message)
                // Refresh stats
                const statsRes = await fetch(`/api/matches/${id}`)
                const statsData = await statsRes.json()
                setVoteStats(statsData.voteStats)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error('ไม่สามารถส่งผลโหวตได้')
        } finally {
            setVoting(null)
        }
    }

    if (loading) return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
    )

    if (!match) return <div>Match not found</div>

    const isCompleted = match.status === 'COMPLETED'
    const isLive = match.status === 'ONGOING'

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Scoreboard */}
            <div className="relative rounded-3xl overflow-hidden bg-black/40 border border-white/10 p-8 md:p-12 text-center space-y-8">
                {/* Background Glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 bg-gradient-to-r from-[${match.homeColor.hexCode}] via-transparent to-[${match.awayColor.hexCode}] blur-3xl -z-10`} />

                <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Trophy className="h-4 w-4" /> {match.event.sportType.name}</span>
                    <span>•</span>
                    <span>{match.roundName}</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="h-24 w-24 md:h-32 md:w-32 rounded-full border-8 shadow-2xl flex items-center justify-center text-3xl font-black bg-black/20 backdrop-blur-md"
                            style={{ borderColor: match.homeColor.hexCode, color: match.homeColor.hexCode }}
                        >
                            {/* Logo */}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black">{match.homeColor.name}</h2>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-4 md:gap-8">
                            <span className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter">{match.homeScore ?? 0}</span>
                            <div className="flex flex-col items-center gap-1 opacity-50">
                                <span className="text-sm font-black uppercase">VS</span>
                            </div>
                            <span className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter">{match.awayScore ?? 0}</span>
                        </div>
                        {isLive && <Badge variant="destructive" className="animate-pulse">LIVE</Badge>}
                        {isCompleted && <Badge variant="secondary">จบการแข่งขัน</Badge>}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Clock className="h-4 w-4" />
                            {format(new Date(match.scheduledAt), 'dd MMM HH:mm', { locale: th })}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="h-24 w-24 md:h-32 md:w-32 rounded-full border-8 shadow-2xl flex items-center justify-center text-3xl font-black bg-black/20 backdrop-blur-md"
                            style={{ borderColor: match.awayColor.hexCode, color: match.awayColor.hexCode }}
                        >
                            {/* Logo */}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black">{match.awayColor.name}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lineups / Participants */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <VoteIcon className="h-5 w-5 text-primary" />
                        โหวตนักกีฬายอดเยี่ยม (MVP)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Home Team Athletes */}
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg" style={{ color: match.homeColor.hexCode }}>
                                    นักกีฬาสี{match.homeColor.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {match.participants
                                    .filter((p: any) => p.color.id === match.homeColorId)
                                    .map((p: any) => (
                                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-white/10">
                                                    <AvatarImage src={p.athlete.photoUrl} />
                                                    <AvatarFallback>{p.athlete.firstName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-sm">{p.athlete.firstName} {p.athlete.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{p.athlete.nickname}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                disabled={voting !== null || !match.event.voteSettings?.votingEnabled}
                                                onClick={() => handleVote(p.athlete.id, p.athlete.firstName)}
                                                className="rounded-lg font-bold"
                                            >
                                                {voting === p.athlete.id ? 'กำลังส่ง...' : 'โหวต'}
                                            </Button>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>

                        {/* Away Team Athletes */}
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg" style={{ color: match.awayColor.hexCode }}>
                                    นักกีฬาสี{match.awayColor.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {match.participants
                                    .filter((p: any) => p.color.id === match.awayColorId)
                                    .map((p: any) => (
                                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-white/10">
                                                    <AvatarImage src={p.athlete.photoUrl} />
                                                    <AvatarFallback>{p.athlete.firstName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-sm">{p.athlete.firstName} {p.athlete.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{p.athlete.nickname}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                disabled={voting !== null || !match.event.voteSettings?.votingEnabled}
                                                onClick={() => handleVote(p.athlete.id, p.athlete.firstName)}
                                                className="rounded-lg font-bold"
                                            >
                                                {voting === p.athlete.id ? 'กำลังส่ง...' : 'โหวต'}
                                            </Button>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Vote Stats */}
                <div>
                    <Card className="glass border-none sticky top-24 h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                อันดับคะแนนโหวต (Live)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {voteStats.length > 0 ? (
                                voteStats.slice(0, 5).map((stat: any, index) => (
                                    <div key={stat.athleteId} className="flex items-center gap-3">
                                        <div className={`
                                            h-6 w-6 rounded-full flex items-center justify-center text-xs font-black
                                            ${index === 0 ? 'bg-amber-500 text-black' :
                                                index === 1 ? 'bg-slate-300 text-black' :
                                                    index === 2 ? 'bg-amber-700 text-white' : 'bg-white/10'}
                                        `}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold truncate">{stat.athleteName}</p>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{ width: `${(stat.count / voteStats[0].count) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold tabular-nums">{stat.count}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    ยังไม่มีคะแนนโหวต
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
