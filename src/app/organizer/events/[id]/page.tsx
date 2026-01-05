'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    Save,
    Trophy,
    CheckCircle2,
    Plus,
    Trash2,
    Loader2,
    Medal,
    Search,
    Calendar,
    Clock,
    MapPin,
    Swords // Icon for matches
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { MatchListEditor } from '@/components/organizer/match-list-editor'

export default function EventResultsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [event, setEvent] = useState<any>(null)
    const [registrations, setRegistrations] = useState<any[]>([])
    const [scoringRules, setScoringRules] = useState<any[]>([])
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('overall')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, regRes, rulesRes, resultsRes] = await Promise.all([
                    fetch(`/api/events/${id}`),
                    fetch(`/api/events/${id}/registrations`),
                    fetch(`/api/scoring-rules`), // Global Rules
                    fetch(`/api/events/${id}/results`)
                ])

                const eventData = await eventRes.json()
                const regData = await regRes.json()
                const rulesData = await rulesRes.json()
                const resultsData = await resultsRes.json()

                setEvent(eventData)
                setRegistrations(regData)
                setScoringRules(rulesData)

                if (resultsData && resultsData.length > 0) {
                    setResults(resultsData)
                } else {
                    setResults([{ colorId: '', athleteId: '', rank: 1, points: 0, score: 0 }])
                }

                // If Team Sport, default to matches tab
                if (eventData.sportType?.category === 'TEAM') {
                    setActiveTab('matches')
                }
            } catch (error) {
                toast.error('ไม่สามารถโหลดข้อมูลได้')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleAddResult = () => {
        const nextRank = results.length + 1
        const defaultPoints = scoringRules.find(r => r.rank === nextRank)?.points || 0
        setResults([...results, { colorId: '', athleteId: '', rank: nextRank, points: defaultPoints, score: 0 }])
    }

    const removeResult = (index: number) => {
        const newResults = results.filter((_, i) => i !== index)
        const adjustedResults = newResults.map((res, i) => {
            const rank = i + 1
            const points = scoringRules.find(r => r.rank === rank)?.points || 0
            return { ...res, rank, points }
        })
        setResults(adjustedResults)
    }

    const updateResult = (index: number, field: string, value: any) => {
        const newResults = [...results]

        if (field === 'athleteId') {
            const reg = registrations.find(r => r.athleteId === value)
            newResults[index].athleteId = value
            newResults[index].colorId = reg?.colorId || ''
        } else if (field === 'rank') {
            const rank = parseInt(value)
            newResults[index].rank = rank
            newResults[index].points = scoringRules.find(r => r.rank === rank)?.points || 0
        } else {
            newResults[index][field] = value
        }

        setResults(newResults)
    }

    const handleSave = async () => {
        const isValid = results.every(r => r.colorId && r.rank)
        if (!isValid) {
            toast.error('กรุณาระบุข้อมูลสีและอันดับให้ครบถ้วน')
            return
        }

        setSaving(true)
        try {
            const res = await fetch(`/api/events/${id}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results })
            })

            if (res.ok) {
                toast.success('บันทึกผลการแข่งขันเรียบร้อยแล้ว')
                router.push('/organizer/events')
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.error || 'เกิดข้อผิดพลาดในการบันทึก')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="space-y-8 animate-pulse container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
    )

    const filteredRegistrations = registrations.filter(r =>
        r.athlete.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.athlete.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.athlete.studentId.includes(searchQuery)
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href="/organizer/events">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <PageHeader
                        title="จัดการผลการแข่งขัน"
                        description={`รายการ: ${event.name} (${event.sportType.name})`}
                    />
                </div>
                {event.status === 'COMPLETED' && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1.5 font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        บันทึกผลแล้ว
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Summary Card */}
                <Card className="glass border-none rounded-3xl overflow-hidden self-start">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-emerald-500" />
                            ข้อมูลสนามกีฬา
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">วันที่</p>
                                    <p className="text-sm font-bold">{format(new Date(event.date), 'dd MMMM yyyy', { locale: th })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">เวลา</p>
                                    <p className="text-sm font-bold">{event.time} น.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-xs uppercase tracking-widest opacity-60">นักกีฬาที่ลงทะเบียน</h4>
                                <Badge variant="outline" className="rounded-md border-white/10 opacity-50">{registrations.length} คน</Badge>
                            </div>
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-50" />
                                <Input
                                    placeholder="ค้นหานักกีฬา..."
                                    className="h-9 pl-9 text-xs glass rounded-xl border-white/5"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto w-full no-scrollbar pr-1">
                                {filteredRegistrations.map((reg: any) => (
                                    <div key={reg.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: reg.color.hexCode }} />
                                            <span className="text-xs font-bold truncate max-w-[120px]" title={`${reg.athlete.firstName} ${reg.athlete.lastName}`}>
                                                {reg.athlete.firstName} {reg.athlete.lastName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Area with Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-2xl mb-6">
                            <TabsTrigger value="matches" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Swords className="h-4 w-4 mr-2" />
                                จัดการแมตช์ (Matches)
                            </TabsTrigger>
                            <TabsTrigger value="overall" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Medal className="h-4 w-4 mr-2" />
                                สรุปอันดับรวม (Overall)
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="matches" className="animate-in fade-in zoom-in-95 duration-300">
                            <MatchListEditor eventId={id} />
                        </TabsContent>

                        <TabsContent value="overall" className="animate-in fade-in zoom-in-95 duration-300">
                            <Card className="glass border-none rounded-3xl overflow-hidden">
                                <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-black flex items-center gap-2">
                                            <Medal className="h-5 w-5 text-amber-500" />
                                            สรุปอันดับและคะแนนรวม
                                        </CardTitle>
                                        <CardDescription>จัดอันดับผู้ชนะและคำนวณคะแนนรวมเพื่อนำไปคิดคะแนนถ้วยรวม</CardDescription>
                                    </div>
                                    <Button onClick={handleAddResult} variant="outline" size="sm" className="rounded-xl glass border-white/10 font-bold">
                                        <Plus className="mr-2 h-4 w-4" />
                                        เพิ่มอันดับ
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-4">
                                        {results.map((res, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">อันดับ</Label>
                                                    <Select onValueChange={(val) => updateResult(idx, 'rank', val)} value={res.rank.toString()}>
                                                        <SelectTrigger className="glass h-11 rounded-xl font-black">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="glass border-white/10 rounded-xl">
                                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(r => (
                                                                <SelectItem key={r} value={r.toString()} className="rounded-lg">อันดับที่ {r}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="md:col-span-5 space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">นักกีฬา / สีทีม</Label>
                                                    <Select onValueChange={(val) => updateResult(idx, 'athleteId', val)} value={res.athleteId}>
                                                        <SelectTrigger className="glass h-11 rounded-xl">
                                                            <SelectValue placeholder="เลือกผู้เข้าแข่งขัน" />
                                                        </SelectTrigger>
                                                        <SelectContent className="glass border-white/10 rounded-xl">
                                                            {registrations.map((reg) => (
                                                                <SelectItem key={reg.athleteId} value={reg.athleteId} className="rounded-lg">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: reg.color.hexCode }} />
                                                                        {reg.athlete.firstName} ({reg.color.name})
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">คะแนนสะสม</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            value={res.points}
                                                            onChange={(e) => updateResult(idx, 'points', parseInt(e.target.value) || 0)}
                                                            className="glass h-11 rounded-xl font-bold pl-10"
                                                        />
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 uppercase tracking-widest">PTS</span>
                                                    </div>
                                                </div>

                                                <div className="md:col-span-1 flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeResult(idx)}
                                                        className="text-destructive hover:bg-destructive/10 rounded-xl h-11 w-11"
                                                        disabled={results.length === 1}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="h-14 rounded-2xl px-12 shadow-glow bg-emerald-600 hover:bg-emerald-500 font-black text-lg min-w-[200px]"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    กำลังบันทึก...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-5 w-5" />
                                                    บันทึกสรุปผล
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
