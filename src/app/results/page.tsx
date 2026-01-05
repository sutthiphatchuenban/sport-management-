'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { MatchCard } from '@/components/matches/match-card'
import { SearchInput } from '@/components/shared/search-input'
import { FilterDropdown } from '@/components/shared/filter-dropdown'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'

interface Match {
    id: string
    roundName: string
    roundNumber: number
    matchNumber: number
    homeColorId: string
    awayColorId: string
    homeScore: number | null
    awayScore: number | null
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
    scheduledAt: string
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

export default function ResultsListPage() {
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sportType, setSportType] = useState('ALL')
    const [sportTypes, setSportTypes] = useState<any[]>([])

    const fetchMatches = async () => {
        try {
            const params = new URLSearchParams({
                status: 'COMPLETED',
            })
            if (sportType !== 'ALL') params.append('sportTypeId', sportType)

            const res = await fetch(`/api/matches?${params.toString()}`)
            const data = await res.json()
            
            // Filter by search if provided
            let filtered = Array.isArray(data) ? data : []
            if (search) {
                filtered = filtered.filter((m: Match) => 
                    m.event.name.toLowerCase().includes(search.toLowerCase()) ||
                    m.event.sportType.name.toLowerCase().includes(search.toLowerCase()) ||
                    m.roundName.toLowerCase().includes(search.toLowerCase())
                )
            }
            
            setMatches(filtered)
        } catch (error) {
            console.error('Failed to fetch matches:', error)
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
        fetchMatches().then(() => setLoading(false))

        // Auto-refresh every 15 seconds
        const interval = setInterval(fetchMatches, 15000)
        return () => clearInterval(interval)
    }, [search, sportType])

    // Group matches by event/sport
    const matchesBySport = matches.reduce((acc: any, match) => {
        const sportName = match.event.sportType.name
        if (!acc[sportName]) {
            acc[sportName] = []
        }
        acc[sportName].push(match)
        return acc
    }, {})

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
            ) : matches.length > 0 ? (
                <div className="space-y-8">
                    {/* Group by Sport Type */}
                    {Object.entries(matchesBySport).map(([sportName, sportMatches]: [string, any]) => (
                        <div key={sportName} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">{sportName}</h3>
                                <div className="h-[1px] flex-1 bg-white/10" />
                                <span className="text-sm text-muted-foreground">
                                    {sportMatches.length} แมช
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {sportMatches.map((match: Match) => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
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
