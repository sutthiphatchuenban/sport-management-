'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { ChevronLeft, Loader2, Users, Trophy } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function OrganizerMatchDetailPage() {
    const params = useParams()
    const matchId = params.matchId as string
    const eventId = params.id as string

    const [match, setMatch] = useState<any>(null)
    const [participants, setParticipants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [colors, setColors] = useState<any[]>([])
    const [availableAthletes, setAvailableAthletes] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchRes, participantsRes, colorsRes] = await Promise.all([
                    fetch(`/api/matches/${matchId}`),
                    fetch(`/api/matches/${matchId}/participants`),
                    fetch('/api/colors')
                ])

                const matchData = await matchRes.json()
                const participantsData = await participantsRes.json()
                const colorsData = await colorsRes.json()

                setMatch(matchData)
                setParticipants(participantsData.participants || [])
                setColors(colorsData)

                // Fetch athletes registered for this event
                const eventRegRes = await fetch(`/api/events/${eventId}/registrations`)
                const eventRegData = await eventRegRes.json()
                setAvailableAthletes(eventRegData || [])
            } catch (error) {
                toast.error('ไม่สามารถโหลดข้อมูลได้')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [matchId, eventId])

    const handleUpdateMatch = async (field: string, value: any) => {
        setSaving(true)
        try {
            const res = await fetch(`/api/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            })

            if (res.ok) {
                const updated = await res.json()
                setMatch(updated)
                toast.success('อัพเดทข้อมูลเรียบร้อย')
            } else {
                toast.error('อัพเดทล้มเหลว')
            }
        } catch (error) {
            toast.error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
        } finally {
            setSaving(false)
        }
    }

    const handleAddParticipant = async (athleteId: string, colorId: string) => {
        try {
            const res = await fetch(`/api/matches/${matchId}/participants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participants: [{ athleteId, colorId }]
                })
            })

            if (res.ok) {
                toast.success('เพิ่มนักกีฬาเรียบร้อย')
                // Refresh participants
                const participantsRes = await fetch(`/api/matches/${matchId}/participants`)
                const participantsData = await participantsRes.json()
                setParticipants(participantsData.participants || [])
            } else {
                toast.error('เพิ่มนักกีฬาล้มเหลว')
            }
        } catch (error) {
            toast.error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
        }
    }

    const handleRemoveParticipant = async (athleteId: string) => {
        try {
            const res = await fetch(`/api/matches/${matchId}/participants?athleteId=${athleteId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('ลบนักกีฬาเรียบร้อย')
                setParticipants(participants.filter(p => p.athleteId !== athleteId))
            } else {
                toast.error('ลบนักกีฬาล้มเหลว')
            }
        } catch (error) {
            toast.error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
        }
    }

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-64 rounded-xl" />
                <Skeleton className="h-64 w-full rounded-3xl" />
                <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
        )
    }

    if (!match) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">ไม่พบข้อมูลแมตช์</p>
                    <Button asChild className="mt-4">
                        <Link href={`/organizer/events/${eventId}`}>กลับไปหน้าก่อน</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const homeParticipants = participants.filter(p => p.colorId === match.homeColorId)
    const awayParticipants = participants.filter(p => p.colorId === match.awayColorId)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 container mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href={`/organizer/events/${eventId}`}>
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title="จัดการแมตช์"
                    description={`${match.event.name} - ${match.roundName}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Match Score Card */}
                <Card className="lg:col-span-2 glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            คะแนนและสถานะ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">สถานะ</Label>
                            <Select
                                value={match.status}
                                onValueChange={(val) => handleUpdateMatch('status', val)}
                                disabled={saving}
                            >
                                <SelectTrigger className="glass h-12 rounded-xl font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SCHEDULED">รอดำเนินการ</SelectItem>
                                    <SelectItem value="ONGOING">กำลังแข่ง (Live)</SelectItem>
                                    <SelectItem value="COMPLETED">จบการแข่งขัน</SelectItem>
                                    <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Teams & Scores */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Home Team */}
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest opacity-60">ทีมเจ้าบ้าน</Label>
                                <Select
                                    value={match.homeColorId}
                                    onValueChange={(val) => handleUpdateMatch('homeColorId', val)}
                                    disabled={saving}
                                >
                                    <SelectTrigger className="glass h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colors.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: c.hexCode }} />
                                                    สี{c.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest opacity-60">คะแนน</Label>
                                    <Input
                                        type="number"
                                        defaultValue={match.homeScore ?? 0}
                                        onBlur={(e) => handleUpdateMatch('homeScore', parseInt(e.target.value) || 0)}
                                        className="glass h-12 rounded-xl text-center text-2xl font-black"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            {/* Away Team */}
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest opacity-60">ทีมเยือน</Label>
                                <Select
                                    value={match.awayColorId}
                                    onValueChange={(val) => handleUpdateMatch('awayColorId', val)}
                                    disabled={saving}
                                >
                                    <SelectTrigger className="glass h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colors.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: c.hexCode }} />
                                                    สี{c.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest opacity-60">คะแนน</Label>
                                    <Input
                                        type="number"
                                        defaultValue={match.awayScore ?? 0}
                                        onBlur={(e) => handleUpdateMatch('awayScore', parseInt(e.target.value) || 0)}
                                        className="glass h-12 rounded-xl text-center text-2xl font-black"
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Scheduled Time */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">วันเวลาที่กำหนด</Label>
                            <Input
                                type="datetime-local"
                                defaultValue={format(new Date(match.scheduledAt), "yyyy-MM-dd'T'HH:mm")}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        handleUpdateMatch('scheduledAt', new Date(e.target.value).toISOString())
                                    }
                                }}
                                className="glass h-12 rounded-xl"
                                disabled={saving}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Participants Card */}
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            นักกีฬาที่ลงแข่ง
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {/* Home Team Participants */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">
                                สี{match.homeColor?.name} ({homeParticipants.length} คน)
                            </Label>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {homeParticipants.map((p: any) => (
                                    <div key={p.id} className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                                        <span className="text-sm font-bold">
                                            {p.athlete.firstName} {p.athlete.lastName}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive"
                                            onClick={() => handleRemoveParticipant(p.athleteId)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Away Team Participants */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">
                                สี{match.awayColor?.name} ({awayParticipants.length} คน)
                            </Label>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {awayParticipants.map((p: any) => (
                                    <div key={p.id} className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                                        <span className="text-sm font-bold">
                                            {p.athlete.firstName} {p.athlete.lastName}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive"
                                            onClick={() => handleRemoveParticipant(p.athleteId)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Participant */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">เพิ่มนักกีฬา</Label>
                            <Select
                                onValueChange={(val) => {
                                    const athlete = availableAthletes.find((a: any) => a.athleteId === val)
                                    if (athlete) {
                                        handleAddParticipant(val, athlete.colorId)
                                    }
                                }}
                            >
                                <SelectTrigger className="glass h-10 rounded-xl">
                                    <SelectValue placeholder="เลือกนักกีฬา..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableAthletes
                                        .filter((a: any) => 
                                            a.colorId === match.homeColorId || a.colorId === match.awayColorId
                                        )
                                        .filter((a: any) => 
                                            !participants.some(p => p.athleteId === a.athleteId)
                                        )
                                        .map((reg: any) => (
                                            <SelectItem key={reg.athleteId} value={reg.athleteId}>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: reg.color.hexCode }} />
                                                    {reg.athlete.firstName} {reg.athlete.lastName} (สี{reg.color.name})
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

