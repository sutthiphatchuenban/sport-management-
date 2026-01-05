'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { Loader2, RefreshCw, Save, Trophy, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface MatchListEditorProps {
    eventId: string
}

export function MatchListEditor({ eventId }: MatchListEditorProps) {
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [colors, setColors] = useState<any[]>([])

    // Fetch colors
    useEffect(() => {
        const fetchColors = async () => {
            const res = await fetch('/api/leaderboard') // Leaderboard returns all colors
            const data = await res.json()
            setColors(data)
        }
        fetchColors()
    }, [])

    const fetchMatches = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/events/${eventId}/matches`)
            const data = await res.json()
            setMatches(data)
        } catch (error) {
            toast.error('โหลดข้อมูลแมตช์ไม่สำเร็จ')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMatches()
    }, [eventId])

    const handleUpdateMatch = async (matchId: string, data: any) => {
        setSavingId(matchId)
        try {
            const res = await fetch(`/api/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('อัพเดทข้อมูลแมตช์เรียบร้อย')
                fetchMatches() // Refresh to see updates (e.g. status badge)
            } else {
                toast.error('อัพเดทล้มเหลว')
            }
        } catch (error) {
            toast.error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
        } finally {
            setSavingId(null)
        }
    }

    if (loading) return <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>

    // Group matches by round
    const rounds = matches.reduce((acc: any, match) => {
        if (!acc[match.roundName]) acc[match.roundName] = []
        acc[match.roundName].push(match)
        return acc
    }, {})

    return (
        <Card className="glass border-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-black">จัดการแมตช์การแข่งขัน</CardTitle>
                    <CardDescription>บันทึกผลคะแนนและสถานะของแต่ละคู่</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchMatches}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                {Object.keys(rounds).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        ยังไม่มีแมตช์การแข่งขัน (ระบบจะสร้างให้อัตโนมัติเมื่อลงทะเบียนครบ หรือต้องสร้างเอง)
                        {/* Future: Add button to create match manually */}
                    </div>
                )}

                {Object.entries(rounds).map(([roundName, roundMatches]: [string, any]) => (
                    <div key={roundName} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-bold bg-white/5 border-white/10 uppercase tracking-widest px-3 py-1">
                                {roundName}
                            </Badge>
                            <div className="h-[1px] flex-1 bg-white/10" />
                        </div>

                        <div className="grid gap-4">
                            {roundMatches.map((match: any) => (
                                <div key={match.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        {/* Time & Status */}
                                        <div className="w-full md:w-32 flex flex-col gap-2">
                                            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                <span>Match {match.matchNumber}</span>
                                                <span>•</span>
                                                <span>{format(new Date(match.scheduledAt), 'HH:mm')}</span>
                                            </div>
                                            <Select
                                                value={match.status}
                                                onValueChange={(val) => handleUpdateMatch(match.id, { status: val })}
                                            >
                                                <SelectTrigger className={`
                                                    h-8 text-xs font-bold border-none
                                                    ${match.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' :
                                                        match.status === 'ONGOING' ? 'bg-red-500/20 text-red-500 animate-pulse' :
                                                            'bg-white/10 text-muted-foreground'}
                                                `}>
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
                                        <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 w-full">
                                            {/* Home */}
                                            <div className="flex-1 flex items-center justify-end gap-2 text-right">
                                                <Select
                                                    value={match.homeColorId}
                                                    onValueChange={(val) => handleUpdateMatch(match.id, { homeColorId: val })}
                                                >
                                                    <SelectTrigger className="h-8 border-none bg-transparent hover:bg-white/5 data-[placeholder]:text-muted-foreground justify-end gap-2 px-2 text-sm font-bold w-fit">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {colors.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>สี{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <div
                                                    className="w-8 h-8 rounded-full border-2 flex-shrink-0"
                                                    style={{ borderColor: match.homeColor?.hexCode || '#333', backgroundColor: (match.homeColor?.hexCode || '#333') + '40' }}
                                                />
                                            </div>

                                            {/* Score Inputs */}
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    defaultValue={match.homeScore ?? 0}
                                                    className="w-16 h-12 text-center text-xl font-black bg-black/20 border-white/10 rounded-xl"
                                                    onBlur={(e) => handleUpdateMatch(match.id, { homeScore: parseInt(e.target.value) })}
                                                />
                                                <span className="text-muted-foreground font-black text-xs">:</span>
                                                <Input
                                                    type="number"
                                                    defaultValue={match.awayScore ?? 0}
                                                    className="w-16 h-12 text-center text-xl font-black bg-black/20 border-white/10 rounded-xl"
                                                    onBlur={(e) => handleUpdateMatch(match.id, { awayScore: parseInt(e.target.value) })}
                                                />
                                            </div>

                                            {/* Away */}
                                            <div className="flex-1 flex items-center justify-start gap-2 text-left">
                                                <div
                                                    className="w-8 h-8 rounded-full border-2 flex-shrink-0"
                                                    style={{ borderColor: match.awayColor?.hexCode || '#333', backgroundColor: (match.awayColor?.hexCode || '#333') + '40' }}
                                                />
                                                <Select
                                                    value={match.awayColorId}
                                                    onValueChange={(val) => handleUpdateMatch(match.id, { awayColorId: val })}
                                                >
                                                    <SelectTrigger className="h-8 border-none bg-transparent hover:bg-white/5 data-[placeholder]:text-muted-foreground justify-start gap-2 px-2 text-sm font-bold w-fit">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {colors.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>สี{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Action / Save Indicator */}
                                        <div className="w-24 flex items-center justify-center gap-2">
                                            {savingId === match.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                <Link href={`/organizer/events/${eventId}/matches/${match.id}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
