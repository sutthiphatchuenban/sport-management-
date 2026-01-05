'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { StatsCard } from '@/components/shared/stats-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Star, Vote, Calendar, ChevronLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function AthleteProfilePage() {
    const params = useParams()
    const id = params.id as string
    const [athlete, setAthlete] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [athleteRes, statsRes] = await Promise.all([
                    fetch(`/api/athletes/${id}`),
                    fetch(`/api/athletes/${id}/stats`)
                ])
                const athleteData = await athleteRes.json()
                const statsData = await statsRes.json()

                setAthlete(athleteData)
                setStats(statsData)
            } catch (error) {
                console.error('Failed to fetch athlete data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <Skeleton className="h-10 w-32" />
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            </div>
        )
    }

    if (!athlete) return null

    return (
        <div className="container mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-500">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/athletes">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    กลับไปหน้านักกีฬา
                </Link>
            </Button>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                <div className="relative">
                    <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-background shadow-2xl ring-2 ring-white/10">
                        <AvatarImage src={athlete.photoUrl || undefined} />
                        <AvatarFallback className="text-4xl font-black">{athlete.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                        className="absolute -bottom-2 -right-2 h-10 w-10 md:h-12 md:w-12 rounded-2xl border-4 border-background flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: athlete.color.hexCode }}
                    >
                        <Trophy className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                </div>
                <div className="text-center md:text-left space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            {athlete.firstName} {athlete.lastName}
                        </h1>
                        <Badge variant="outline" className="text-lg px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary">
                            {athlete.nickname ? `(${athlete.nickname})` : athlete.studentId}
                        </Badge>
                    </div>
                    <p className="text-xl text-muted-foreground font-bold">
                        สี{athlete.color.name} • {athlete.major.name}
                    </p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="รายการที่แข่งไปแล้ว"
                    value={stats?.summary?.totalEvents || 0}
                    icon={Calendar}
                    description="จากที่ลงทะเบียนทั้งหมด"
                />
                <StatsCard
                    label="เหรียญทอง"
                    value={stats?.summary?.goldMedals || 0}
                    icon={Medal}
                    color="text-yellow-500"
                />
                <StatsCard
                    label="คะแนนสะสม"
                    value={stats?.summary?.totalPoints || 0}
                    icon={Star}
                    color="text-blue-500"
                />
                <StatsCard
                    label="คะแนนโหวต (MVP)"
                    value={stats?.summary?.totalVotes || 0}
                    icon={Vote}
                    color="text-pink-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event History */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-primary" />
                        ประวัติการแข่งขัน
                    </h2>
                    <div className="space-y-4">
                        {stats?.results?.length > 0 ? (
                            stats.results.map((res: any) => (
                                <Card key={res.id} className="glass border-none overflow-hidden transition-all hover:translate-x-1">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-12 w-12 rounded-xl flex items-center justify-center font-black text-xl",
                                                res.rank === 1 ? "bg-yellow-500 text-white shadow-glow shadow-yellow-500/50" : "bg-white/5"
                                            )}>
                                                {res.rank}
                                            </div>
                                            <div>
                                                <p className="font-bold">{res.event.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(res.recordedAt).toLocaleDateString('th-TH')}</span>
                                                    <span className="flex items-center gap-1 text-primary font-bold">+{res.points} Pts</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="border-white/10">COMPLETED</Badge>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="h-32 rounded-3xl border border-dashed flex items-center justify-center text-muted-foreground italic">
                                ยังไม่มีผลการแข่งขันที่บันทึก
                            </div>
                        )}
                    </div>
                </div>

                {/* Awards & Other */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        รางวัลที่ได้รับ
                    </h2>
                    <div className="space-y-4">
                        {stats?.awards?.length > 0 ? (
                            stats.awards.map((winner: any) => (
                                <Card key={winner.id} className="bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500/20 rounded-2xl">
                                    <CardHeader className="p-4 flex flex-row items-center gap-4">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-500 text-white">
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{winner.award.name}</CardTitle>
                                            <p className="text-xs text-yellow-500/80 font-bold uppercase tracking-widest">Official Award</p>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))
                        ) : (
                            <div className="h-32 rounded-3xl bg-white/5 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                                <Star className="h-8 w-8 opacity-20" />
                                <span className="text-sm">ยังไม่มีรางวัลอย่างเป็นทางการ</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
