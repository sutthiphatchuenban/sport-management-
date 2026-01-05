'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Calendar as CalendarIcon,
    Trophy,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { th } from 'date-fns/locale'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function OrganizerSchedulePage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/events')
                const data = await res.json()
                setEvents(data)
            } catch (error) {
                console.error('Failed to fetch events:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    // Calendar logic
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 })
    const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek })

    const eventsThisWeek = events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= startOfCurrentWeek && eventDate <= endOfCurrentWeek
    })

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sportType.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7))
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7))

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="ตารางการแข่งขัน (Organizer Schedule)"
                description="ตรวจสอบตารางเวลาการแข่งและจัดการลำดับการทำงานของทีมสต๊าฟ"
            />

            <Tabs defaultValue="calendar" className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList className="glass border-white/10 p-1 h-12 rounded-2xl">
                        <TabsTrigger value="calendar" className="rounded-xl px-6 font-bold data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-500">
                            ปฏิทินรายสัปดาห์
                        </TabsTrigger>
                        <TabsTrigger value="list" className="rounded-xl px-6 font-bold data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-500">
                            รายการทั้งหมด
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                            <Input
                                placeholder="ค้นหาการแข่ง..."
                                className="glass h-11 pl-10 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl glass border-white/10">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="calendar" className="space-y-6">
                    <Card className="glass border-none rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-emerald-500" />
                                    {format(currentDate, 'MMMM yyyy', { locale: th })}
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={prevWeek} className="rounded-xl glass border-white/10 h-10 w-10">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={nextWeek} className="rounded-xl glass border-white/10 h-10 w-10">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-7 border-b border-white/5">
                                {weekDays.map((day, idx) => (
                                    <div key={idx} className={cn(
                                        "p-4 text-center border-r border-white/5 last:border-r-0",
                                        isSameDay(day, new Date()) ? "bg-emerald-500/5" : ""
                                    )}>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">
                                            {format(day, 'EEE', { locale: th })}
                                        </p>
                                        <p className={cn(
                                            "text-lg font-black h-8 w-8 flex items-center justify-center mx-auto rounded-full",
                                            isSameDay(day, new Date()) ? "bg-emerald-500 text-white" : ""
                                        )}>
                                            {format(day, 'd')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 min-h-[400px]">
                                {weekDays.map((day, dayIdx) => {
                                    const dayEvents = eventsThisWeek.filter(e => isSameDay(new Date(e.date), day))
                                    return (
                                        <div key={dayIdx} className={cn(
                                            "p-4 space-y-3 border-r border-white/5 last:border-r-0",
                                            isSameDay(day, new Date()) ? "bg-emerald-500/5" : ""
                                        )}>
                                            {dayEvents.map(event => (
                                                <Link
                                                    key={event.id}
                                                    href={`/organizer/events/${event.id}`}
                                                    className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                                >
                                                    <p className="text-[10px] font-black uppercase text-emerald-500 mb-1 group-hover:translate-x-1 transition-transform">{event.time} น.</p>
                                                    <p className="text-xs font-bold leading-tight line-clamp-2">{event.name}</p>
                                                    <Badge variant="outline" className="mt-2 text-[8px] h-4 border-none bg-white/5 text-muted-foreground">
                                                        {event.sportType.name}
                                                    </Badge>
                                                </Link>
                                            ))}
                                            {dayEvents.length === 0 && (
                                                <div className="h-full flex items-center justify-center opacity-10">
                                                    <Trophy className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="list">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-3xl" />
                            ))
                        ) : filteredEvents.map((event) => (
                            <Link key={event.id} href={`/organizer/events/${event.id}`}>
                                <Card className="glass border-none rounded-3xl hover:scale-[1.02] transition-all cursor-pointer group h-full">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-3 font-bold">
                                                {event.sportType.name}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">เวลาแข่ง</p>
                                                <p className="text-sm font-bold text-emerald-400">{event.time} น.</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black group-hover:text-emerald-400 transition-colors uppercase leading-tight mb-2">
                                                {event.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                <MapPin className="h-3 w-3" />
                                                {event.location || 'ไม่ได้ระบุสนาม'}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-3 w-3 opacity-40" />
                                                <span className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(event.date), 'dd MMM yyyy', { locale: th })}</span>
                                            </div>
                                            <Badge className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                event.status === 'COMPLETED' ? "bg-emerald-500/20 text-emerald-500" :
                                                    event.status === 'ONGOING' ? "bg-amber-500/20 text-amber-500 animate-pulse" :
                                                        "bg-blue-500/20 text-blue-500"
                                            )}>
                                                {event.status}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
