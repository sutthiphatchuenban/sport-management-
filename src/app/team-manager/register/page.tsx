'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    ClipboardCheck,
    Calendar,
    MapPin,
    Clock,
    Users,
    ChevronRight,
    Search,
    Filter,
    Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { useSession } from 'next-auth/react'

export default function EventRegistrationListPage() {
    const { data: session } = useSession()
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events?status=UPCOMING&limit=100')
                const data = await res.json()
                setEvents(data.events || [])
            } catch (error) {
                console.error('Failed to fetch events:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const filteredEvents = events.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.sportType.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="ลงทะเบียนเข้าแข่งขัน"
                description="เลือกรายการที่ยังเปิดรับสมัครเพื่อส่งนักกีฬาในทีมของคุณเข้าร่วม"
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาตามชื่อรายการ หรือประเภทกีฬา..."
                        className="pl-10 glass h-12 rounded-2xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-12 px-4 rounded-2xl glass border-white/10 font-bold">
                        <Trophy className="mr-2 h-4 w-4 text-amber-500" />
                        เปิดรับสมัคร {filteredEvents.length} รายการ
                    </Badge>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="group glass border-none rounded-3xl overflow-hidden hover:scale-[1.02] transition-all flex flex-col">
                            <CardHeader className="bg-white/5 pb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-none rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {event.sportType.name}
                                    </Badge>
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <CardTitle className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{event.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 opacity-50" />
                                        <span>{format(new Date(event.date), 'EEEE d MMMM yyyy', { locale: th })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 opacity-50" />
                                        <span>เวลา {event.time} น.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 opacity-50" />
                                        <span>{event.location || 'ไม่ได้ระบุสนาม'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                                    <span>Athlete Limit</span>
                                    <span className="text-indigo-400">{event.sportType.maxParticipants || 'NO LIMIT'}</span>
                                </div>

                                <div className="mt-auto pt-6">
                                    <Button asChild className="w-full rounded-2xl h-12 font-black shadow-glow group-hover:bg-indigo-600 transition-colors">
                                        <Link href={`/team-manager/register/${event.id}`}>
                                            เลือกนักกีฬาส่งแข่ง
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {filteredEvents.length === 0 && !loading && (
                <div className="text-center py-40 glass rounded-3xl border border-dashed border-white/5">
                    <p className="text-muted-foreground italic">ไม่พบรายการแข่งขันที่เปิดให้ลงทะเบียน</p>
                </div>
            )}
        </div>
    )
}
