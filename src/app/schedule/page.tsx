'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { TournamentBracket } from '@/components/matches/tournament-bracket'
import { MatchCard } from '@/components/matches/match-card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { CalendarDays, Trophy } from 'lucide-react'

interface SportSchedule {
    id: string
    name: string
    category: string
    matches: any[]
    bracket?: any[]
}

export default function SchedulePage() {
    const [sports, setSports] = useState<SportSchedule[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch activities (Events)
                const res = await fetch('/api/events?includeResults=true') // We might need a better endpoint for all matches
                const events = await res.json()
                const data = Array.isArray(events) ? events : events.events

                // 2. Fetch bracket/matches for each TEAM event
                const teamEvents = data.filter((e: any) => e.sportType.category === 'TEAM')

                const sportsData = await Promise.all(teamEvents.map(async (event: any) => {
                    try {
                        const bracketRes = await fetch(`/api/events/${event.id}/bracket`)
                        const bracketData = await bracketRes.json()
                        return {
                            id: event.id,
                            name: event.sportType.name,
                            category: event.sportType.category,
                            matches: bracketData.bracket?.flatMap((r: any) => r.matches) || [], // All matches flat
                            bracket: bracketData.bracket
                        }
                    } catch (e) {
                        return null
                    }
                }))

                const validSports = sportsData.filter(Boolean) as SportSchedule[]
                setSports(validSports)
                if (validSports.length > 0) {
                    setActiveTab(validSports[0].id)
                }
            } catch (error) {
                console.error('Failed to load schedule', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-[80vh]">
            <PageHeader
                title="ตารางการแข่งขัน"
                description="ติดตามเส้นทางการแข่งขันและผลการแข่งขันแบบ Tournament"
            />

            {loading ? (
                <div className="space-y-6">
                    <Skeleton className="h-10 w-full md:w-1/2 rounded-xl" />
                    <Skeleton className="h-96 w-full rounded-3xl" />
                </div>
            ) : sports.length > 0 ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-transparent h-auto flex-wrap justify-start gap-2 p-0">
                        {sports.map((sport) => (
                            <TabsTrigger
                                key={sport.id}
                                value={sport.id}
                                className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
                            >
                                {sport.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {sports.map((sport) => (
                        <TabsContent key={sport.id} value={sport.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Bracket View */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                    <h3 className="text-lg font-bold">เส้นทางสู่แชมป์</h3>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm overflow-hidden">
                                    <TournamentBracket rounds={sport.bracket || []} />
                                </div>
                            </section>

                            {/* Match List View */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <CalendarDays className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-bold">รายการแมตช์ทั้งหมด</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sport.matches.map((match) => (
                                        <MatchCard key={match.id} match={match} />
                                    ))}
                                </div>
                            </section>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <EmptyState
                    title="ยังไม่มีตารางการแข่งขัน"
                    description="ตารางการแข่งขันจะปรากฏเมื่อมีการจับคู่ทีมเรียบร้อยแล้ว"
                />
            )}
        </div>
    )
}
