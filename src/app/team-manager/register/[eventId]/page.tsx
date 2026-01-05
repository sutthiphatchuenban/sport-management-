'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    ClipboardCheck,
    Calendar,
    MapPin,
    Clock,
    Users,
    ChevronLeft,
    CheckCircle2,
    Users2,
    Search,
    Loader2,
    UserPlus,
    XCircle,
    Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { useSession } from 'next-auth/react'

export default function EventRegistrationPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()

    const [event, setEvent] = useState<any>(null)
    const [athletes, setAthletes] = useState<any[]>([])
    const [registrations, setRegistrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.colorId) return
            try {
                const [eventRes, athletesRes, regsRes] = await Promise.all([
                    fetch(`/api/events/${params.eventId}`),
                    fetch(`/api/athletes?colorId=${session.user.colorId}&limit=200`),
                    fetch(`/api/events/${params.eventId}/registrations`)
                ])

                const eventData = await eventRes.json()
                const athletesData = await athletesRes.json()
                const regsData = await regsRes.json()

                setEvent(eventData)
                setAthletes(athletesData.athletes || [])
                setRegistrations(regsData || [])

                // Initialize selected IDs with already registered athletes from this team
                const teamRegIds = (regsData || [])
                    .filter((r: any) => r.colorId === session.user.colorId)
                    .map((r: any) => r.athleteId)
                setSelectedIds(teamRegIds)

            } catch (error) {
                console.error('Failed to fetch data:', error)
                toast.error('ไม่สามารถโหลดข้อมูลได้')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.eventId, session])

    const handleToggle = (athleteId: string, isRegistered: boolean) => {
        if (isRegistered) return // Can't unregister easily if already confirmed in real system, but here we can toggle if we want. 
        // For simplicity, lets allow toggling the selection of NOT YET registered athletes

        setSelectedIds(prev =>
            prev.includes(athleteId)
                ? prev.filter(id => id !== athleteId)
                : [...prev, athleteId]
        )
    }

    const handleSave = async () => {
        setSubmitting(true)
        try {
            const res = await fetch(`/api/events/${params.eventId}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ athleteIds: selectedIds })
            })

            if (!res.ok) {
                const error = await res.json()
                toast.error(error.error || 'การลงทะเบียนล้มเหลว')
            } else {
                toast.success('บันทึกการลงทะเบียนนักกีฬาเรียบร้อย')
                router.push('/team-manager/register')
                router.refresh()
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-16 w-1/3 rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-1 h-[400px] rounded-3xl" />
                    <Skeleton className="lg:col-span-2 h-[600px] rounded-3xl" />
                </div>
            </div>
        )
    }

    const filteredAthletes = athletes.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        a.studentId.includes(search)
    )

    const alreadyRegisteredIds = registrations.map((r: any) => r.athleteId)
    const otherTeamsRegCount = registrations.filter((r: any) => r.colorId !== session?.user?.colorId).length

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/team-manager/register">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title={`ลงทะเบียนส่งแข่ง: ${event.name}`}
                    description="เลือกนักกีฬาที่ต้องการลงสมัครในรายการนี้"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Info Card */}
                <div className="space-y-6">
                    <Card className="glass border-none rounded-3xl overflow-hidden self-start">
                        <CardHeader className="bg-white/5 pb-8 font-black uppercase tracking-tighter">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Flame className="h-5 w-5 text-indigo-400" />
                                รายละเอียดรายการ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-indigo-400" />
                                        <span className="font-bold">{format(new Date(event.date), 'd MMMM yyyy', { locale: th })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="h-4 w-4 text-indigo-400" />
                                        <span className="font-bold">เวลา {event.time} น.</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-indigo-400" />
                                        <span className="font-bold">{event.location || 'ไม่ได้ระบุสนาม'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                        <span>ประเภทกีฬา</span>
                                        <Badge variant="secondary" className="rounded-md font-bold">{event.sportType.name}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                        <span>Max Participants</span>
                                        <span className="text-white">{event.sportType.maxParticipants || 'Unlimited'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                        <span>ทีมอื่นส่งแล้ว</span>
                                        <span className="text-white">{otherTeamsRegCount} คน</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-indigo-600 rounded-3xl border-none p-8 text-white">
                        <div className="space-y-4">
                            <Users2 className="h-8 w-8" />
                            <h4 className="text-xl font-black">สรุปการเลือก</h4>
                            <p className="text-4xl font-black">{selectedIds.length} <span className="text-sm opacity-60">คน selected</span></p>
                            <Button
                                className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-black h-12 rounded-2xl mt-4"
                                onClick={handleSave}
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                ยืนยันการส่งนักกีฬา
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Athlete Selection Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass border-none rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-400" />
                                    รายชื่อนิสิตในสังกัด
                                </CardTitle>
                                <CardDescription>คลิกเพื่อเลือกนักกีฬาที่ต้องการลงสมัคร</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="ค้นชื่อ หรือ รหัส..."
                                    className="pl-10 glass h-10 rounded-xl"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredAthletes.map((athlete) => {
                                    const isRegistered = alreadyRegisteredIds.includes(athlete.id)
                                    const isSelected = selectedIds.includes(athlete.id)

                                    return (
                                        <div
                                            key={athlete.id}
                                            onClick={() => handleToggle(athlete.id, isRegistered)}
                                            className={`
                                                p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group
                                                ${isSelected || isRegistered
                                                    ? 'bg-indigo-600/10 border-indigo-500/30'
                                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    h-10 w-10 rounded-xl flex items-center justify-center transition-colors
                                                    ${isSelected || isRegistered ? 'bg-indigo-600' : 'bg-white/10'}
                                                `}>
                                                    {isRegistered ? <CheckCircle2 className="h-5 w-5 text-white" /> : <Users className="h-5 w-5 opacity-40" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm ${isSelected || isRegistered ? 'text-indigo-400' : ''}`}>
                                                        {athlete.firstName} {athlete.lastName}
                                                    </span>
                                                    <span className="text-[10px] font-mono opacity-30">{athlete.studentId}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                {isRegistered ? (
                                                    <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-400 border-none font-black h-4 px-1">
                                                        REGISTERED
                                                    </Badge>
                                                ) : isSelected ? (
                                                    <Badge className="text-[8px] bg-indigo-600 text-white font-black h-4 px-1">
                                                        SELECTED
                                                    </Badge>
                                                ) : null}
                                                <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${isSelected || isRegistered ? 'bg-indigo-600 border-none' : 'border-white/20'}`}>
                                                    {(isSelected || isRegistered) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                {filteredAthletes.length === 0 && (
                                    <div className="col-span-full py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-4">
                                        <Users className="h-8 w-8 opacity-20" />
                                        <p className="text-muted-foreground text-sm italic">ไม่พบรายชื่อนิสิตในเกณฑ์ที่ค้นหา</p>
                                        <Button variant="outline" asChild className="rounded-xl border-white/10">
                                            <Link href="/team-manager/athletes/new">เพิ่มนักกีฬาใหม่</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
