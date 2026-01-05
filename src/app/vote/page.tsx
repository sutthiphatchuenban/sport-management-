'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { EventCard } from '@/components/shared/event-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Vote } from 'lucide-react'

export default function VotingLandingPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVotingEvents = async () => {
            try {
                // Fetch all events and filter for those with voting enabled and ongoing/upcoming
                const res = await fetch('/api/events')
                const data = await res.json()

                // We'll need to check vote settings for each event if we want to be precise,
                // but for now let's filter by status and assume they might have voting.
                // Better yet, let's just show ongoing events as they are most likely to have voting.
                const safeEvents = Array.isArray(data) ? data : data.events || []
                const activeEvents = safeEvents.filter((e: any) => e.status === 'ONGOING' || e.status === 'UPCOMING')
                setEvents(activeEvents)
            } catch (error) {
                console.error('Failed to fetch voting events:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchVotingEvents()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
            <PageHeader
                title="ระบบโหวตนักกีฬายอดเยี่ยม"
                description="ร่วมส่งคะแนนโหวตให้กับนักกีฬาที่คุณประทับใจ เพื่อรางวัล Popular Vote"
            />

            <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-glow">
                    <Vote className="h-8 w-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold">เปิดโหวตแล้ววันนี้!</h2>
                    <p className="text-muted-foreground">เลือกรายการแข่งขันที่ต้องการโหวตจากรายการด้านล่าง</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {events.map((event) => (
                        <Link key={event.id} href={`/vote/${event.id}`}>
                            <EventCard
                                name={event.name}
                                sportType={event.sportType.name}
                                date={new Date(event.date)}
                                time={event.time}
                                location={event.location}
                                status={event.status}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="ยังไม่มีรายการที่เปิดโหวต"
                    description="โปรดติดตามประกาศช่วงเวลาการโหวตจากทางผู้จัดงาน"
                />
            )}
        </div>
    )
}
