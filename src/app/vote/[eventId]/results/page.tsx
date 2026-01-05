'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { LeaderboardChart } from '@/components/shared/leaderboard-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Vote, ChevronLeft, RefreshCcw, Info } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function VotingResultsPage() {
    const params = useParams()
    const eventId = params.eventId as string

    const [event, setEvent] = useState<any>(null)
    const [stats, setStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = async () => {
        setRefreshing(true)
        try {
            const [eventRes, statsRes] = await Promise.all([
                fetch(`/api/events/${eventId}`),
                fetch(`/api/votes/${eventId}/stats`)
            ])
            const eventData = await eventRes.json()
            const statsData = await statsRes.json()

            setEvent(eventData)
            setStats(statsData)
        } catch (error) {
            console.error('Failed to fetch voting stats:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchData()

        // Auto refresh every 15 seconds
        const interval = setInterval(fetchData, 15000)
        return () => clearInterval(interval)
    }, [eventId])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-48 w-full rounded-3xl" />
                <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
        )
    }

    if (!event) return null

    // Transform stats for LeaderboardChart
    const chartData = stats.map(s => ({
        id: s.athleteId,
        name: `${s.athlete.firstName} (${s.athlete.nickname || s.athlete.color.name})`,
        score: s.totalVotes,
        hexCode: s.athlete.color.hexCode
    }))

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href={`/vote/${eventId}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        กลับไปหน้าลงคะแนน
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchData}
                    disabled={refreshing}
                    className="glass border-white/10"
                >
                    <RefreshCcw className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")} />
                    อัปเดตสด
                </Button>
            </div>

            <PageHeader
                title={`ผลการโหวต: ${event.name}`}
                description="คะแนนโหวตยอดนิยมแบบเรียลไทม์จากผู้ร่วมงานทุกคน"
            />

            {stats.length === 0 ? (
                <Card className="glass border-none py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <Vote className="h-12 w-12 text-muted-foreground opacity-20" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">ยังไม่มีคะแนนโหวต</h3>
                            <p className="text-muted-foreground">เริ่มเปิดรับโหวตแล้ว ร่วมเป็นคนแรกในการตัดสิน!</p>
                        </div>
                        <Button asChild>
                            <Link href={`/vote/${eventId}`}>ไปหน้าโหวต</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <div className="h-8 w-1 bg-primary rounded-full" />
                            อันดับคะแนนโหวต
                        </h2>
                        <LeaderboardChart data={chartData} />

                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-start gap-3">
                            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                ผลคะแนนนี้เป็นเพียงการแสดงผลเบื้องต้น (Real-time Results)
                                ผลสรุปอย่างเป็นทางการจะถูกประกาศหลังจากเสร็จสิ้นกิจกรรมทั้งหมด
                                และผ่านการตรวจสอบความถูกต้องโดยคณะกรรมการ
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <div className="h-8 w-1 bg-pink-500 rounded-full" />
                            ทำเนียบโหวตสูงสุด
                        </h2>
                        <div className="grid gap-4">
                            {stats.slice(0, 5).map((s) => (
                                <Card key={s.athleteId} className="glass border-none overflow-hidden hover:translate-x-1 transition-transform">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 rounded-full border-2 border-white/10 overflow-hidden">
                                                <img
                                                    src={s.athlete.photoUrl || 'https://picsum.photos/200'}
                                                    alt={s.athlete.firstName}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div
                                                    className="absolute inset-x-0 bottom-0 h-1"
                                                    style={{ backgroundColor: s.athlete.color.hexCode }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold">{s.athlete.firstName} {s.athlete.lastName}</p>
                                                <p className="text-xs text-muted-foreground">สี{s.athlete.color.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gradient">{s.totalVotes}</p>
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-50">Votes</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
