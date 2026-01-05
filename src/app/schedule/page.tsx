'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { EventCard } from '@/components/shared/event-card'
import { SearchInput } from '@/components/shared/search-input'
import { FilterDropdown } from '@/components/shared/filter-dropdown'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, List } from 'lucide-react'
import Link from 'next/link'

export default function SchedulePage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('ALL')
    const [sportType, setSportType] = useState('ALL')
    const [sportTypes, setSportTypes] = useState<any[]>([])

    const fetchEvents = async () => {
        try {
            const params = new URLSearchParams({
                search: search,
            })
            if (status !== 'ALL') params.append('status', status)
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
    }, [search, status, sportType])

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
            <PageHeader
                title="ตารางการแข่งขัน"
                description="ติดตามกำหนดการแข่งขันทั้งหมด ไม่พลาดทุกแมตช์สำคัญ"
            />

            <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="flex-1">
                        <SearchInput
                            placeholder="ค้นหาชื่อรายการ..."
                            onSearch={setSearch}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <FilterDropdown
                            label="สถานะ"
                            options={[
                                { label: 'ทั้งหมด', value: 'ALL' },
                                { label: 'เตรียมการ', value: 'UPCOMING' },
                                { label: 'กำลังแข่ง', value: 'ONGOING' },
                                { label: 'จบแล้ว', value: 'COMPLETED' },
                            ]}
                            value={status}
                            onValueChange={setStatus}
                        />
                    </div>
                    <div className="w-full md:w-48">
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

                {/* View Toggler (Placeholder for now) */}
                <Tabs defaultValue="list" className="w-auto">
                    <TabsList className="glass border-white/10 rounded-2xl h-11 p-1">
                        <TabsTrigger value="list" className="rounded-xl px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs gap-2">
                            <List className="h-4 w-4" />
                            รายการ
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="rounded-xl px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            ปฏิทิน
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl" />)}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
                        <Link key={event.id} href={event.status === 'COMPLETED' ? `/results/${event.id}` : '#'}>
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
                    title="ไม่พบรายการที่ค้นหา"
                    description="ลองปรับเปลี่ยนเงื่อนไขการค้นหาดูอีกครั้ง"
                />
            )}
        </div>
    )
}
