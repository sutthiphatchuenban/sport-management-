'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Award,
    Medal,
    Trophy,
    Users,
    History,
    Search,
    Plus,
    CheckCircle2,
    Calendar,
    LogOut,
    ExternalLink,
    Loader2
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function OrganizerAwardsPage() {
    const [awards, setAwards] = useState<any[]>([])
    const [recentWinners, setRecentWinners] = useState<any[]>([])
    const [athletes, setAthletes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form states
    const [selectedAward, setSelectedAward] = useState('')
    const [selectedAthlete, setSelectedAthlete] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const [awardsRes, athleteRes, winnersRes] = await Promise.all([
                fetch('/api/awards'),
                fetch('/api/athletes'),
                fetch('/api/organizer/stats') // Re-using to get latest winners in the same format
            ])

            const awardsData = await awardsRes.json()
            const athletesData = await athleteRes.json()
            const statsData = await winnersRes.json()

            setAwards(awardsData)
            setAthletes(athletesData.athletes || [])
            setRecentWinners(statsData.latestAwards || [])
        } catch (error) {
            toast.error('ไม่สามารถโหลดข้อมูลรางวัลได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAnnounce = async () => {
        if (!selectedAward || !selectedAthlete) {
            toast.error('กรุณาเลือกรางวัลและนักกีฬา')
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/admin/awards/winners', { // Assuming the same endpoint as admin for now
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    winners: [
                        { awardId: selectedAward, athleteId: selectedAthlete }
                    ]
                })
            })

            if (res.ok) {
                toast.success('ประกาศรางวัลเรียบร้อยแล้ว')
                setIsDialogOpen(false)
                setSelectedAward('')
                setSelectedAthlete('')
                fetchData()
            } else {
                toast.error('เกิดข้อผิดพลาดในการบันทึก')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="ประกาศรางวัลพิเศษ (Award Announcement)"
                    description="จัดการการประกาศรางวัล MVP, ขวัญใจทีมงาน และรางวัลพิเศษอื่นๆ ประจำปี"
                />
                <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl shadow-glow bg-amber-600 hover:bg-amber-500 font-black h-12 px-8">
                    <Plus className="mr-2 h-5 w-5" />
                    ประกาศรางวัลใหม่
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available Awards Inventory */}
                <Card className="lg:col-span-2 glass border-none rounded-3xl overflow-hidden self-start">
                    <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black flex items-center gap-2 text-amber-500">
                                <Award className="h-5 w-5" />
                                หมวดหมู่รางวัลทั้งหมด
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {awards.map(award => (
                                    <div key={award.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform">
                                                <Trophy className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate">{award.name}</h4>
                                                <Badge className="text-[8px] bg-white/5 text-muted-foreground border-none h-4 uppercase">{award.awardType}</Badge>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 italic mb-3">"{award.description || 'ไม่มีรายละเอียด'}"</p>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                            <span>Winners: {award._count?.winners || 0}</span>
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] p-0 hover:bg-transparent hover:text-amber-500">VIEW DETAILS</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Announcement History History */}
                <Card className="glass border-none rounded-3xl overflow-hidden h-full">
                    <CardHeader className="bg-white/5 border-b border-white/5 pb-6">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <History className="h-5 w-5 text-emerald-400" />
                            ประวัติล่าสุด
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
                            ) : recentWinners.length > 0 ? (
                                recentWinners.map((winner: any) => (
                                    <div key={winner.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-white/10">
                                        <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">{winner.award.name}</p>
                                            <h5 className="font-bold text-sm">{winner.athlete.firstName} {winner.athlete.lastName}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: winner.athlete.color.hexCode }} />
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">สี{winner.athlete.color.name}</span>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground mt-1">{format(new Date(winner.createdAt), 'dd MMM HH:mm', { locale: th })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-muted-foreground italic text-xs">ยังไม่มีการประกาศรางวัล</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Announcement Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass border-white/10 rounded-3xl max-w-lg overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500" />
                    <DialogHeader className="pt-6">
                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                            <Medal className="h-6 w-6 text-amber-500" />
                            ประกาศผู้ได้รับรางวัล
                        </DialogTitle>
                        <DialogDescription>เลือกหมวดหมู่รางวัลและนักกีฬาที่เหมาะสมเพื่อประกาศผลอย่างเป็นทางการ</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">รางวัลที่ประกาศ</Label>
                            <Select onValueChange={setSelectedAward} value={selectedAward}>
                                <SelectTrigger className="glass h-12 rounded-xl border-white/5">
                                    <SelectValue placeholder="เลือกรางวัล..." />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10 rounded-xl">
                                    {awards.map(award => (
                                        <SelectItem key={award.id} value={award.id} className="rounded-lg">
                                            {award.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60">ผู้ได้รับรางวัล</Label>
                            <Select onValueChange={setSelectedAthlete} value={selectedAthlete}>
                                <SelectTrigger className="glass h-12 rounded-xl border-white/5">
                                    <SelectValue placeholder="ค้นหานักกีฬา..." />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10 rounded-xl max-h-[250px]">
                                    {athletes.map(athlete => (
                                        <SelectItem key={athlete.id} value={athlete.id} className="rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: athlete.color.hexCode }} />
                                                {athlete.firstName} {athlete.lastName} (@{athlete.studentId})
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pb-2">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">ยกเลิก</Button>
                        <Button
                            className="bg-amber-600 hover:bg-amber-500 rounded-xl px-12 h-12 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black text-lg"
                            onClick={handleAnnounce}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Medal className="mr-2 h-5 w-5" />}
                            ประกาศผลทันที
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
