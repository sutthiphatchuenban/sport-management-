'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { ResultPodium } from '@/components/shared/result-podium'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Calendar, MapPin, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function EventResultDetailPage() {
    const params = useParams()
    const eventId = params.eventId as string
    const [event, setEvent] = useState<any>(null)
    const [results, setResults] = useState<any[]>([])
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
                setResults(resultData)
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

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/results">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    กลับไปหน้าผลการแข่งขัน
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-2">
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
                        <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-primary" />
                            {event.sportType.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Podium Display */}
            <section className="py-8">
                <h2 className="text-2xl font-bold mb-8 text-center">ผู้ชนะในรายการนี้</h2>
                <ResultPodium
                    first={results.find(r => r.rank === 1) ? {
                        name: results.find(r => r.rank === 1).athlete ? `${results.find(r => r.rank === 1).athlete.firstName} ${results.find(r => r.rank === 1).athlete.lastName}` : `ทีมสี${results.find(r => r.rank === 1).color.name}`,
                        colorName: results.find(r => r.rank === 1).color.name,
                        hexCode: results.find(r => r.rank === 1).color.hexCode,
                        photoUrl: results.find(r => r.rank === 1).athlete?.photoUrl
                    } : { name: '-', colorName: '-', hexCode: '#eee' }}
                    second={results.find(r => r.rank === 2) ? {
                        name: results.find(r => r.rank === 2).athlete ? `${results.find(r => r.rank === 2).athlete.firstName} ${results.find(r => r.rank === 2).athlete.lastName}` : `ทีมสี${results.find(r => r.rank === 2).color.name}`,
                        colorName: results.find(r => r.rank === 2).color.name,
                        hexCode: results.find(r => r.rank === 2).color.hexCode,
                        photoUrl: results.find(r => r.rank === 2).athlete?.photoUrl
                    } : undefined}
                    third={results.find(r => r.rank === 3) ? {
                        name: results.find(r => r.rank === 3).athlete ? `${results.find(r => r.rank === 3).athlete.firstName} ${results.find(r => r.rank === 3).athlete.lastName}` : `ทีมสี${results.find(r => r.rank === 3).color.name}`,
                        colorName: results.find(r => r.rank === 3).color.name,
                        hexCode: results.find(r => r.rank === 3).color.hexCode,
                        photoUrl: results.find(r => r.rank === 3).athlete?.photoUrl
                    } : undefined}
                />
            </section>

            {/* All Rankings Table */}
            <section className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xl font-bold">อันดับทั้งหมด</h2>
                <div className="grid gap-4">
                    {results.sort((a, b) => a.rank - b.rank).map((result) => (
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
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Points Received</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}
