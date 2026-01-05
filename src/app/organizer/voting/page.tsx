'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
    Vote,
    Settings2,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock,
    Trophy,
    Loader2,
    Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function OrganizerVotingPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form states for the dialog
    const [votingEnabled, setVotingEnabled] = useState(false)
    const [maxVotes, setMaxVotes] = useState(1)
    const [showResults, setShowResults] = useState(true)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/organizer/voting')
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลระบบโหวตได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const openSettings = (event: any) => {
        setSelectedEvent(event)
        const settings = event.voteSettings || {}
        setVotingEnabled(settings.votingEnabled ?? false)
        setMaxVotes(settings.maxVotesPerUser ?? 1)
        setShowResults(settings.showRealtimeResults ?? true)
        setStartTime(settings.votingStart ? new Date(settings.votingStart).toISOString().slice(0, 16) : '')
        setEndTime(settings.votingEnd ? new Date(settings.votingEnd).toISOString().slice(0, 16) : '')
        setIsDialogOpen(true)
    }

    const saveSettings = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/organizer/voting/${selectedEvent.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    votingEnabled,
                    maxVotesPerUser: maxVotes,
                    showRealtimeResults: showResults,
                    votingStart: startTime || null,
                    votingEnd: endTime || null
                })
            })

            if (res.ok) {
                toast.success('อัปเดตการตั้งค่าการโหวตสำเร็จ')
                setIsDialogOpen(false)
                fetchEvents()
            } else {
                const data = await res.json()
                toast.error(data.error || 'ไม่สามารถบันทึกได้')
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการบันทึก')
        } finally {
            setSaving(false)
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'รายการแข่งขัน',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold">{row.original.name}</span>
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-40">{row.original.sportType.name}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'voteSettings',
            header: 'สถานะการโหวต',
            cell: ({ row }) => {
                const isEnabled = row.original.voteSettings?.votingEnabled
                return isEnabled ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold">
                        <CheckCircle2 className="mr-1.5 h-3 w-3" />
                        เปิดใช้งาน
                    </Badge>
                ) : (
                    <Badge variant="outline" className="opacity-40 font-bold border-white/10">
                        <XCircle className="mr-1.5 h-3 w-3" />
                        ปิด
                    </Badge>
                )
            }
        },
        {
            accessorKey: '_count',
            header: 'ยอดโหวตปัจจุบัน',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-black text-pink-500">
                    <Vote className="h-4 w-4" />
                    {row.original._count.votes.toLocaleString()} PV
                </div>
            )
        },
        {
            accessorKey: 'time',
            header: 'ช่วงเวลากำหนด',
            cell: ({ row }) => {
                const s = row.original.voteSettings?.votingStart
                const e = row.original.voteSettings?.votingEnd
                if (!s && !e) return <span className="text-xs opacity-30 italic">ไม่ได้กำหนด</span>
                return (
                    <div className="text-[10px] font-mono opacity-60 flex flex-col">
                        <span>S: {s ? format(new Date(s), 'dd/MM HH:mm') : '-'}</span>
                        <span>E: {e ? format(new Date(e), 'dd/MM HH:mm') : '-'}</span>
                    </div>
                )
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-9 glass border-white/10 font-bold"
                        onClick={() => openSettings(row.original)}
                    >
                        <Settings2 className="mr-2 h-4 w-4" />
                        ตั้งค่า
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl h-9 text-pink-500 hover:bg-pink-500/10 font-bold"
                        asChild
                    >
                        <a href={`/vote/${row.original.id}/results`} target="_blank">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            ดูผล
                        </a>
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="จัดการระบบโหวต (Voting Control)"
                description="เปิด-ปิดสถานะการโหวตระดับรายการรายคน และติดตามยอดโหวต Real-time"
            />

            <div className="glass border-none rounded-3xl p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={events}
                        searchKey="name"
                        searchPlaceholder="ค้นหาชื่อรายการ..."
                    />
                )}
            </div>

            {/* Settings Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass border-white/10 rounded-3xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                            <Settings2 className="h-6 w-6 text-pink-500" />
                            ตั้งค่าการโหวต: {selectedEvent?.name}
                        </DialogTitle>
                        <DialogDescription>กำหนดสิทธิ์และช่วงเวลาที่เปิดให้นิสิตร่วมโหวตในรายการนี้</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">เปิดใช้งานการโหวต</Label>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Global Status for this event</p>
                            </div>
                            <Switch checked={votingEnabled} onCheckedChange={setVotingEnabled} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold opacity-60">จำนวนโหวตต่อคน (Max)</Label>
                                <Input
                                    type="number"
                                    value={maxVotes}
                                    onChange={(e) => setMaxVotes(parseInt(e.target.value) || 1)}
                                    className="glass rounded-xl h-11 font-bold"
                                />
                            </div>
                            <div className="flex flex-col justify-center space-y-2">
                                <Label className="text-xs font-bold opacity-60">แสดงผล Real-time</Label>
                                <div className="flex items-center h-11">
                                    <Switch checked={showResults} onCheckedChange={setShowResults} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                ช่วงเวลาเปิดโหวต (Optional)
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold">เริ่มเวลา</Label>
                                    <Input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="glass rounded-xl h-10 text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold">สิ้นสุดเวลา</Label>
                                    <Input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="glass rounded-xl h-10 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">ยกเลิก</Button>
                        <Button
                            className="bg-pink-600 hover:bg-pink-500 rounded-xl px-8 shadow-glow font-black"
                            onClick={saveSettings}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            บันทึกการตั้งค่า
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
