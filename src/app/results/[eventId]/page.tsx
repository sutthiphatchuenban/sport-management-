'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, MapPin, ChevronLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface EventResult {
    id: string
    rank: number
    points: number
    score?: number | null
    color: {
        id: string
        name: string
        hexCode: string
    }
    athlete?: {
        firstName: string
        lastName: string
        nickname?: string
    } | null
}

interface Event {
    id: string
    name: string
    date: string
    time: string
    location?: string
    status: string
    sportType: {
        name: string
        category: 'INDIVIDUAL' | 'TEAM'
    }
}

export default function EventResultDetailPage() {
    const params = useParams()
    const eventId = params.eventId as string
    const [event, setEvent] = useState<Event | null>(null)
    const [results, setResults] = useState<EventResult[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, resultRes] = await Promise.all([
                    fetch(`/api/events/${eventId}`),
                    fetch(`/api/events/${eventId}/results`)
                ])
                const eventData = await eventRes.json()
                const resultData = await resultRes.json()

                setEvent(eventData)
                setResults(Array.isArray(resultData) ? resultData : [])
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

        const interval = setInterval(fetchData, 15000)
        return () => clearInterval(interval)
    }, [eventId])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        )
    }

    if (!event) return null

    // Check if this is a head-to-head match (exactly 2 teams with scores)
    const isHeadToHead = results.length === 2 && results.every(r => r.score !== null && r.score !== undefined)
    const sortedResults = [...results].sort((a, b) => a.rank - b.rank)

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/results">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    กลับไปหน้าผลการแข่งขัน
                </Link>
            </Button>

            {/* Event Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-bold uppercase">
                        {event.sportType.name}
                    </Badge>
                    <Badge
                        variant={event.status === 'COMPLETED' ? 'default' : 'outline'}
                        className="text-xs font-bold"
                    >
                        {event.status === 'COMPLETED' ? 'จบแล้ว' : event.status === 'ONGOING' ? 'กำลังแข่ง' : 'เตรียมการ'}
                    </Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-foreground">
                    {event.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.date), 'dd MMMM yyyy', { locale: th })}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location || 'คณะวิทยาการสารสนเทศ'}
                    </div>
                </div>
            </div>

            {/* Match Result Display */}
            {isHeadToHead ? (
                // Head-to-Head Match Display (e.g., IT 5 - 0 CS)
                <section className="py-8">
                    <Card className="glass border-none overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-center gap-4 md:gap-8">
                                {/* Team 1 */}
                                <div className="flex-1 text-center space-y-4">
                                    <div
                                        className="mx-auto h-20 w-20 md:h-28 md:w-28 rounded-full border-4 border-white/20 flex items-center justify-center"
                                        style={{ backgroundColor: sortedResults[0]?.color.hexCode }}
                                    >
                                        <Users className="h-10 w-10 md:h-14 md:w-14 text-white/80" />
                                    </div>
                                    <div>
                                        <p className="text-xl md:text-2xl font-black">สี{sortedResults[0]?.color.name}</p>
                                        {sortedResults[0]?.athlete && (
                                            <p className="text-sm text-muted-foreground">
                                                {sortedResults[0].athlete.firstName} {sortedResults[0].athlete.lastName}
                                            </p>
                                        )}
                                    </div>
                                    {sortedResults[0]?.rank === 1 && (
                                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                                            <Trophy className="h-3 w-3 mr-1" />
                                            ชนะ
                                        </Badge>
                                    )}
                                </div>

                                {/* Score */}
                                <div className="flex items-center gap-2 md:gap-4">
                                    <span
                                        className="text-5xl md:text-7xl font-black"
                                        style={{ color: sortedResults[0]?.color.hexCode }}
                                    >
                                        {sortedResults[0]?.score ?? 0}
                                    </span>
                                    <span className="text-3xl md:text-5xl font-bold text-muted-foreground">-</span>
                                    <span
                                        className="text-5xl md:text-7xl font-black"
                                        style={{ color: sortedResults[1]?.color.hexCode }}
                                    >
                                        {sortedResults[1]?.score ?? 0}
                                    </span>
                                </div>

                                {/* Team 2 */}
                                <div className="flex-1 text-center space-y-4">
                                    <div
                                        className="mx-auto h-20 w-20 md:h-28 md:w-28 rounded-full border-4 border-white/20 flex items-center justify-center"
                                        style={{ backgroundColor: sortedResults[1]?.color.hexCode }}
                                    >
                                        <Users className="h-10 w-10 md:h-14 md:w-14 text-white/80" />
                                    </div>
                                    <div>
                                        <p className="text-xl md:text-2xl font-black">สี{sortedResults[1]?.color.name}</p>
                                        {sortedResults[1]?.athlete && (
                                            <p className="text-sm text-muted-foreground">
                                                {sortedResults[1].athlete.firstName} {sortedResults[1].athlete.lastName}
                                            </p>
                                        )}
                                    </div>
                                    {sortedResults[1]?.rank === 1 && (
                                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                                            <Trophy className="h-3 w-3 mr-1" />
                                            ชนะ
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Points Summary */}
                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center gap-8">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">คะแนนที่ได้</p>
                                    <p className="text-2xl font-black text-primary">+{sortedResults[0]?.points ?? 0}</p>
                                    <p className="text-xs text-muted-foreground">สี{sortedResults[0]?.color.name}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">คะแนนที่ได้</p>
                                    <p className="text-2xl font-black text-primary">+{sortedResults[1]?.points ?? 0}</p>
                                    <p className="text-xs text-muted-foreground">สี{sortedResults[1]?.color.name}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            ) : (
                // Ranking-based Display (for multiple teams or individual sports)
                <>
                    {/* Podium */}
                    <section className="py-8">
                        <h2 className="text-2xl font-bold mb-8 text-center">ผู้ชนะในรายการนี้</h2>
                        <div className="flex items-end justify-center gap-4 max-w-2xl mx-auto">
                            {/* 2nd Place */}
                            {sortedResults[1] && (
                                <div className="flex-1 text-center">
                                    <div
                                        className="h-20 w-20 mx-auto rounded-full border-4 border-white/20 flex items-center justify-center mb-4"
                                        style={{ backgroundColor: sortedResults[1].color.hexCode }}
                                    >
                                        <span className="text-2xl font-black text-white">2</span>
                                    </div>
                                    <div className="h-24 rounded-t-xl flex items-center justify-center"
                                        style={{ backgroundColor: sortedResults[1].color.hexCode + '40' }}>
                                        <div>
                                            <p className="font-bold text-sm">
                                                {sortedResults[1].athlete
                                                    ? `${sortedResults[1].athlete.firstName}`
                                                    : `สี${sortedResults[1].color.name}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">+{sortedResults[1].points} คะแนน</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {sortedResults[0] && (
                                <div className="flex-1 text-center">
                                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                    <div
                                        className="h-24 w-24 mx-auto rounded-full border-4 border-yellow-500 flex items-center justify-center mb-4"
                                        style={{ backgroundColor: sortedResults[0].color.hexCode }}
                                    >
                                        <span className="text-3xl font-black text-white">1</span>
                                    </div>
                                    <div className="h-32 rounded-t-xl flex items-center justify-center"
                                        style={{ backgroundColor: sortedResults[0].color.hexCode + '40' }}>
                                        <div>
                                            <p className="font-bold">
                                                {sortedResults[0].athlete
                                                    ? `${sortedResults[0].athlete.firstName}`
                                                    : `สี${sortedResults[0].color.name}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground">+{sortedResults[0].points} คะแนน</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {sortedResults[2] && (
                                <div className="flex-1 text-center">
                                    <div
                                        className="h-16 w-16 mx-auto rounded-full border-4 border-white/20 flex items-center justify-center mb-4"
                                        style={{ backgroundColor: sortedResults[2].color.hexCode }}
                                    >
                                        <span className="text-xl font-black text-white">3</span>
                                    </div>
                                    <div className="h-16 rounded-t-xl flex items-center justify-center"
                                        style={{ backgroundColor: sortedResults[2].color.hexCode + '40' }}>
                                        <div>
                                            <p className="font-bold text-sm">
                                                {sortedResults[2].athlete
                                                    ? `${sortedResults[2].athlete.firstName}`
                                                    : `สี${sortedResults[2].color.name}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">+{sortedResults[2].points} คะแนน</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* All Rankings */}
                    <section className="max-w-4xl mx-auto space-y-6">
                        <h2 className="text-xl font-bold">อันดับทั้งหมด</h2>
                        <div className="grid gap-4">
                            {sortedResults.map((result) => (
                                <Card key={result.id} className="glass overflow-hidden border-none transition-transform hover:translate-x-1">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-black text-lg">
                                                {result.rank}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="h-8 w-8 rounded-full border border-white/10"
                                                    style={{ backgroundColor: result.color.hexCode }}
                                                />
                                                <div>
                                                    <p className="font-bold">
                                                        {result.athlete ? `${result.athlete.firstName} ${result.athlete.lastName}` : `ทีมสี${result.color.name}`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {result.athlete?.nickname ? `(${result.athlete.nickname}) ` : ''}
                                                        สี{result.color.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-gradient">+{result.points}</p>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">คะแนน</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
