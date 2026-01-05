'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { EventCard } from '@/components/shared/event-card'
import { SearchInput } from '@/components/shared/search-input'
import { FilterDropdown } from '@/components/shared/filter-dropdown'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function ResultsListPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sportType, setSportType] = useState('ALL')
    const [sportTypes, setSportTypes] = useState<any[]>([])

    const fetchEvents = async () => {
        try {
            const params = new URLSearchParams({
                status: 'COMPLETED',
                search: search,
            })
            if (sportType !== 'ALL') params.append('sportTypeId', sportType)

            const res = await fetch(`/api/events?${params.toString()}`)
            const data = await res.json()
            setEvents(Array.isArray(data) ? data : data.events || [])
        } catch (error) {
            console.error('Failed to fetch events:', error)
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
        fetchEvents().then(() => setLoading(false))

        // Auto-refresh every 15 seconds
        const interval = setInterval(fetchEvents, 15000)
        return () => clearInterval(interval)
    }, [search, sportType])

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
            <PageHeader
                title="ผลการแข่งขัน"
                description="สรุปผลการแข่งขันและทำเนียบผู้ชนะในแต่ละรายการ"
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <SearchInput
                        placeholder="ค้นหาชื่อรายการ..."
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

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {events.map((event) => (
                        <Link key={event.id} href={`/results/${event.id}`}>
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
                    title="ไม่พบผลการแข่งขัน"
                    description="ยังไม่มีรายการที่แข่งขันจบหรือตามเงื่อนไขที่ระบุ"
                />
            )}
        </div>
    )
}
