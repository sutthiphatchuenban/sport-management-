'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { ResultPodium } from '@/components/shared/result-podium'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Star, User, Crown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function AwardsPage() {
    const [awards, setAwards] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAwardsWithWinners = async () => {
            try {
                // Fetch all winners and awards
                const [awardsRes, winnersRes] = await Promise.all([
                    fetch('/api/awards'),
                    fetch('/api/awards/winners')
                ])
                const awardsData = await awardsRes.json()
                const winnersData = await winnersRes.json()

                const safeAwards = Array.isArray(awardsData) ? awardsData : awardsData.awards || []
                const safeWinners = Array.isArray(winnersData) ? winnersData : winnersData.winners || []

                // Group winners by award
                const awardsWithWinners = safeAwards.map((award: any) => ({
                    ...award,
                    winners: safeWinners.filter((w: any) => w.awardId === award.id)
                }))

                setAwards(awardsWithWinners)
            } catch (error) {
                console.error('Failed to fetch awards:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAwardsWithWinners()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8 space-y-12 min-h-screen">
            <PageHeader
                title="รางวัลเกียรติยศ"
                description="ทำเนียบผู้ได้รับรางวัลยอดเยี่ยมและรางวัลพิเศษประจำการแข่งขัน"
            />

            {loading ? (
                <div className="space-y-12">
                    {[1, 2].map(i => (
                        <div key={i} className="space-y-8">
                            <Skeleton className="h-10 w-64 mx-auto" />
                            <Skeleton className="h-64 w-full rounded-3xl" />
                        </div>
                    ))}
                </div>
            ) : awards.length > 0 ? (
                <div className="space-y-24">
                    {awards.map((award) => (
                        <section key={award.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest">
                                    <Crown className="h-4 w-4" />
                                    {award.awardType || award.type}
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gradient">{award.name}</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">{award.description}</p>
                            </div>

                            {award.winners.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {award.winners.map((winner: any) => (
                                        <Card key={winner.id} className="group overflow-hidden border-none glass transition-all hover:scale-[1.02]">
                                            <CardContent className="p-0">
                                                <div className="relative h-48 overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                                                    <img
                                                        src={winner.athlete.photoUrl || 'https://picsum.photos/400/300'}
                                                        alt={winner.athlete.firstName}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-4 right-4 z-20">
                                                        <div
                                                            className="h-10 w-10 rounded-xl flex items-center justify-center border-2 border-white/20 shadow-xl"
                                                            style={{ backgroundColor: winner.athlete.color.hexCode }}
                                                        >
                                                            <Trophy className="h-5 w-5 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 space-y-4 -mt-12 relative z-20">
                                                    <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl space-y-3">
                                                        <div className="space-y-1 text-center">
                                                            <h3 className="text-xl font-black tracking-tight">
                                                                {winner.athlete.firstName} {winner.athlete.lastName}
                                                            </h3>
                                                            <p className="text-sm font-bold text-muted-foreground uppercase opacity-70">
                                                                สี{winner.athlete.color.name} • {winner.athlete.major.name}
                                                            </p>
                                                        </div>
                                                        <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <Star className="h-4 w-4 text-yellow-500 mb-1" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Winner</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <Medal className="h-10 w-10 opacity-10" />
                                    <p className="font-bold italic">รางวัลนี้จะประกาศรายชื่อผู้ชนะเร็วๆ นี้</p>
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                    <Trophy className="h-20 w-20 text-muted-foreground opacity-10" />
                    <h2 className="text-2xl font-bold opacity-50">ยังไม่มีข้อมูลรางวัลในขณะนี้</h2>
                </div>
            )}
        </div>
    )
}
