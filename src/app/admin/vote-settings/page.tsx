'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import {
    Save,
    Vote,
    Loader2,
    ShieldCheck,
    BarChart3,
    CalendarDays
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function VoteSettingsPage() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/vote-settings')
            const data = await res.json()
            setSettings(data)
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลการตั้งค่าได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/vote-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })

            if (res.ok) {
                toast.success('บันทึกการตั้งค่าระบบโหวตสำเร็จ')
                fetchSettings()
            } else {
                toast.error('เกิดข้อผิดพลาดในการบันทึก')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-8 max-w-3xl mx-auto">
                <Skeleton className="h-20 w-full rounded-3xl" />
                <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <PageHeader
                title="ตั้งค่าระบบโหวตส่วนกลาง"
                description="ควบคุมการเปิด-ปิดระบบโหวต และกำหนดนโยบายการโหวตหลักของทั้งระบบ"
            />

            <div className="grid gap-6">
                {/* Global Activation */}
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    การเปิดใช้งานระบบ (Global Switch)
                                </CardTitle>
                                <CardDescription>ควบคุมการโหวตทั้งหมดในระบบผ่านสวิตช์เดียว</CardDescription>
                            </div>
                            <Switch
                                checked={settings.votingEnabled}
                                onCheckedChange={(val) => setSettings({ ...settings, votingEnabled: val })}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <Label className="font-bold flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 opacity-50" />
                                    วันเริ่มต้นการโหวต
                                </Label>
                                <Input
                                    type="datetime-local"
                                    value={settings.votingStart ? new Date(settings.votingStart).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setSettings({ ...settings, votingStart: e.target.value })}
                                    className="glass h-12 rounded-xl"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <Label className="font-bold flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 opacity-50" />
                                    วันสิ้นสุดการโหวต
                                </Label>
                                <Input
                                    type="datetime-local"
                                    value={settings.votingEnd ? new Date(settings.votingEnd).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setSettings({ ...settings, votingEnd: e.target.value })}
                                    className="glass h-12 rounded-xl"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Voting Policy */}
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Vote className="h-5 w-5 text-primary" />
                            นโยบายการโหวต (Voting Policy)
                        </CardTitle>
                        <CardDescription>กำหนดสิทธิ์และข้อจำกัดของผู้ใช้งานในการโหวต</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="maxVotes" className="font-bold text-lg">โควต้าการโหวตต่อผู้ใช้งาน</Label>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-primary">{settings.maxVotesPerUser}</span>
                                    <span className="text-sm font-bold opacity-30 uppercase tracking-widest">โหวต</span>
                                </div>
                            </div>
                            <Input
                                id="maxVotes"
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={settings.maxVotesPerUser}
                                onChange={(e) => setSettings({ ...settings, maxVotesPerUser: parseInt(e.target.value) })}
                                className="h-2 bg-white/5 rounded-full accent-primary cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground italic">
                                * จำนวนยอดโหวตสูงสุดที่หนึ่งผู้ใช้งานสามารถโหวตให้กับนักกีฬาในแต่ละรายการ (หรือรวมทั้งระบบ ขึ้นอยู่กับการตั้งค่าระดับกิจกรรม)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Transparency Settings */}
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-pink-500" />
                                    ความโปร่งใสและผลลัพธ์
                                </CardTitle>
                                <CardDescription>การแสดงผลคะแนนในหน้าเว็บไซต์สาธารณะ</CardDescription>
                            </div>
                            <Switch
                                checked={settings.showRealtimeResults}
                                onCheckedChange={(val) => setSettings({ ...settings, showRealtimeResults: val })}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <BarChart3 className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold">แสดงผลลัพธ์แบบ Real-time</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    หากเปิดใช้งาน ผู้รับชมทั่วไปจะสามารถเห็นกราฟสถิติการโหวตแบบสดๆ ได้ในหน้า /vote/results
                                    หากปิดใช้งาน ผลลัพธ์จะถูกซ่อนไว้จนกว่าผู้จัดงานจะประกาศอย่างเป็นทางการ
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl h-14 px-12 shadow-glow font-black text-lg">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            กำลังบันทึก...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-5 w-5" />
                            บันทึกการตั้งค่าระบบ
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
