'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import {
    Save,
    Plus,
    Trash2,
    ScrollText,
    Loader2,
    Info
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ScoringRulesPage() {
    const [rules, setRules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchRules = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/scoring-rules')
            const data = await res.json()
            setRules(data)
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลเกณฑ์การให้คะแนนได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRules()
    }, [])

    const addRule = () => {
        const nextRank = rules.length + 1
        setRules([...rules, { rank: nextRank, points: 0 }])
    }

    const removeRule = (index: number) => {
        const newRules = rules.filter((_, i) => i !== index)
        // Re-calculate ranks
        const reRanked = newRules.map((r, i) => ({ ...r, rank: i + 1 }))
        setRules(reRanked)
    }

    const updatePoints = (index: number, points: number) => {
        const newRules = [...rules]
        newRules[index].points = points
        setRules(newRules)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/scoring-rules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rules })
            })

            if (res.ok) {
                toast.success('บันทึกเกณฑ์การให้คะแนนสำเร็จ')
                fetchRules()
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <PageHeader
                title="ระดับคะแนน (Scoring Rules)"
                description="กำหนดคะแนนมาตรฐานสำหรับอันดับต่างๆ ในแผนกกีฬาพื้นฐาน"
            />

            <Card className="glass border-none rounded-3xl overflow-hidden">
                <CardHeader className="bg-white/5 pb-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <ScrollText className="h-5 w-5 text-primary" />
                                เกณฑ์คะแนนพื้นฐาน
                            </CardTitle>
                            <CardDescription>อันดับและแต้มสะสมที่จะคำนวณเข้าสู่คะแนนรวมของสี</CardDescription>
                        </div>
                        <Button onClick={addRule} variant="outline" size="sm" className="rounded-xl glass border-white/10">
                            <Plus className="mr-2 h-4 w-4" />
                            เพิ่มอันดับ
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                <div className="col-span-3">อันดับ</div>
                                <div className="col-span-6">คะแนนที่ได้รับ</div>
                                <div className="col-span-3 text-right">การจัดการ</div>
                            </div>

                            {rules.map((rule, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary">
                                                {rule.rank}
                                            </div>
                                            <span className="font-bold hidden sm:inline">อันดับที่ {rule.rank}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-6">
                                        <div className="relative group">
                                            <Input
                                                type="number"
                                                value={rule.points}
                                                onChange={(e) => updatePoints(idx, parseInt(e.target.value) || 0)}
                                                className="glass h-11 rounded-xl pl-10 font-bold text-lg"
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50 font-black text-xs">PTS</div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRule(idx)}
                                            className="text-destructive hover:bg-destructive/10 rounded-xl"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {rules.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl text-muted-foreground italic">
                                    ยังไม่มีการกำหนดเกณฑ์คะแนน
                                </div>
                            )}

                            <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                                <Info className="h-5 w-5 text-amber-500 shrink-0" />
                                <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                                    * หลังจากบันทึกเกณฑ์ใหม่ คะแนนจะถูกนำไปใช้อัตโนมัติในรายการแข่งขันที่กำลังจะมาถึง
                                    สำหรับรายการที่แข่งขันจบไปแล้ว คะแนนจะยังเป็นแบบเดิมจนกว่าจะมีการอัปเดตผลการแข่งขันใหม่อีกครั้ง
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={loading || saving} className="rounded-xl h-12 px-12 shadow-glow font-bold">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังบันทึก...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            บันทึกการตั้งค่าทั้งหมด
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
