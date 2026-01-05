'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { MatchCard } from '@/components/matches/match-card'
import { SearchInput } from '@/components/shared/search-input'
import { FilterDropdown } from '@/components/shared/filter-dropdown'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Medal, ArrowRight } from 'lucide-react'
import Link from 'next/link'
interface MatchWithColors {
    id: string
    roundName: string
    roundNumber: number
    matchNumber: number
    homeColorId: string
    awayColorId: string
    homeScore: number | null
    awayScore: number | null
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
    scheduledAt: Date | string
    homeColor: {
        id: string
        name: string
        hexCode: string
    }
    awayColor: {
        id: string
        name: string
        hexCode: string
    }
    event: {
        id: string
        name: string
        sportType: {
            name: string
            category: 'INDIVIDUAL' | 'TEAM'
        }
    }
}

interface EventWithResults {
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
    results?: Array<{
        rank: number
        points: number
        color: {
            id: string
            name: string
            hexCode: string
        }
    }>
}

export default function ResultsListPage() {
    const [matches, setMatches] = useState<MatchWithColors[]>([])
    const [events, setEvents] = useState<EventWithResults[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sportType, setSportType] = useState('ALL')
    const [sportTypes, setSportTypes] = useState<any[]>([])

    const fetchData = async () => {
        try {
            // Fetch matches
            const matchParams = new URLSearchParams({
                status: 'COMPLETED',
            })
            if (sportType !== 'ALL') matchParams.append('sportTypeId', sportType)

            const matchRes = await fetch(`/api/matches?${matchParams.toString()}`)
            const matchData = await matchRes.json()
            
            // Filter matches by search if provided and convert scheduledAt to Date
            let filteredMatches = Array.isArray(matchData) ? matchData : []
            if (search) {
                filteredMatches = filteredMatches.filter((m: any) => 
                    m.event?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    m.event?.sportType?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    m.roundName?.toLowerCase().includes(search.toLowerCase())
                )
            }
            
            // Convert scheduledAt from string to Date
            const matchesWithDates = filteredMatches.map((m: any) => ({
                ...m,
                scheduledAt: m.scheduledAt ? new Date(m.scheduledAt) : new Date()
            })) as MatchWithColors[]
            
            setMatches(matchesWithDates)

            // Fetch completed events with results
            const eventParams = new URLSearchParams({
                status: 'COMPLETED',
                includeResults: 'true'
            })
            if (sportType !== 'ALL') eventParams.append('sportTypeId', sportType)

            const eventRes = await fetch(`/api/events?${eventParams.toString()}`)
            const eventData = await eventRes.json()
            
            // Filter events by search if provided
            let filteredEvents = Array.isArray(eventData) ? eventData : []
            if (search) {
                filteredEvents = filteredEvents.filter((e: any) => 
                    e.name?.toLowerCase().includes(search.toLowerCase()) ||
                    e.sportType?.name?.toLowerCase().includes(search.toLowerCase())
                )
            }
            
            setEvents(filteredEvents as EventWithResults[])
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
    }

    const fetchSportTypes = async () => {
        try {
            const res = await fetch('/api/sport-types')
            const data = await res.json()
            setSportTypes(data)
        } catch (error) {
            console.error('Failed to fetch sport types:', error)
        }
    }

    useEffect(() => {
        fetchSportTypes()
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchData().then(() => setLoading(false))

        // Auto-refresh every 15 seconds
        const interval = setInterval(fetchData, 15000)
        return () => clearInterval(interval)
    }, [search, sportType])

    // Group matches by event/sport
    const matchesBySport = matches.reduce((acc: any, match) => {
        const sportName = match.event.sportType.name
        if (!acc[sportName]) {
            acc[sportName] = { matches: [], events: [] }
        }
        acc[sportName].matches.push(match)
        return acc
    }, {})

    // Group events by sport
    events.forEach(event => {
        const sportName = event.sportType.name
        if (!matchesBySport[sportName]) {
            matchesBySport[sportName] = { matches: [], events: [] }
        }
        matchesBySport[sportName].events.push(event)
    })

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
            <PageHeader
                title="ผลการแข่งขัน"
                description="สรุปผลการแข่งขันและคะแนนในแต่ละแมช"
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <SearchInput
                        placeholder="ค้นหาชื่อรายการหรือรอบการแข่งขัน..."
                        onSearch={(val) => setSearch(val)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <FilterDropdown
                        label="ประเภทกีฬา"
                        options={[
                            { label: 'ทุกประเภท', value: 'ALL' },
                            ...sportTypes.map(t => ({ label: t.name, value: t.id }))
                        ]}
                        value={sportType}
                        onValueChange={setSportType}
                    />
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
                </div>
            ) : matches.length > 0 || events.length > 0 ? (
                <div className="space-y-8">
                    {/* Group by Sport Type */}
                    {Object.entries(matchesBySport).map(([sportName, sportData]: [string, any]) => (
                        <div key={sportName} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">{sportName}</h3>
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-sm text-muted-foreground">
                                    {sportData.matches?.length || 0} แมช • {sportData.events?.length || 0} รายการ
                                </span>
                            </div>

                            {/* Event Results Summary Cards */}
                            {sportData.events && sportData.events.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-amber-500" />
                                        สรุปผลการแข่งขัน
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sportData.events.map((event: EventWithResults) => {
                                            const sortedResults = event.results?.sort((a, b) => a.rank - b.rank) || []
                                            const top3 = sortedResults.slice(0, 3)
                                            
                                            return (
                                                <Card key={event.id} className="glass border-none overflow-hidden hover:bg-white/10 transition-colors">
                                                    <CardContent className="p-5">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h5 className="font-bold text-lg mb-1">{event.name}</h5>
                                                                <p className="text-xs text-muted-foreground">{event.sportType.name}</p>
                                                            </div>
                                                            
                                                            {/* Top 3 Results */}
                                                            {top3.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {top3.map((result, idx) => (
                                                                        <div key={result.color.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                                                                                    idx === 0 ? 'bg-amber-500 text-black' :
                                                                                    idx === 1 ? 'bg-slate-300 text-black' :
                                                                                    'bg-amber-700 text-white'
                                                                                }`}>
                                                                                    {result.rank}
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <div 
                                                                                        className="w-3 h-3 rounded-full border"
                                                                                        style={{ backgroundColor: result.color.hexCode }}
                                                                                    />
                                                                                <span className="text-sm font-medium">สี{result.color.name}</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{result.points}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-muted-foreground text-center py-2">
                                                                    ยังไม่มีผลการแข่งขัน
                                                                </p>
                                                            )}
                                                            
                                                            <Button 
                                                                asChild 
                                                                variant="outline" 
                                                                className="w-full glass border-white/10 hover:bg-white/10"
                                                            >
                                                                <Link href={`/results/${event.id}`}>
                                                                    <Medal className="h-4 w-4 mr-2" />
                                                                    ดูสรุปผลทั้งหมด
                                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Match Cards */}
                            {sportData.matches && sportData.matches.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold">รายการแมตช์</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {sportData.matches.map((match: MatchWithColors) => (
                                            <MatchCard 
                                                key={match.id} 
                                                match={{
                                                    ...match,
                                                    scheduledAt: match.scheduledAt instanceof Date 
                                                        ? match.scheduledAt 
                                                        : new Date(match.scheduledAt)
                                                }} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="ไม่พบผลการแข่งขัน"
                    description="ยังไม่มีแมชที่แข่งขันจบหรือตามเงื่อนไขที่ระบุ"
                />
            )}
        </div>
    )
}
