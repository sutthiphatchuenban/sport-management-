'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { athleteSchema } from '@/lib/validations'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, X, User as UserIcon, Palette, GraduationCap, MapPin } from 'lucide-react'
import Link from 'next/link'

interface AthleteFormProps {
    initialData?: any
    athleteId?: string
    fixedColorId?: string // Used for Team Managers to lock their own color
}

export function AthleteForm({ initialData, athleteId, fixedColorId }: AthleteFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [majors, setMajors] = useState<any[]>([])
    const [colors, setColors] = useState<any[]>([])

    const form = useForm({
        resolver: zodResolver(athleteSchema),
        defaultValues: initialData || {
            studentId: '',
            firstName: '',
            lastName: '',
            nickname: '',
            majorId: '',
            colorId: fixedColorId || '',
            photoUrl: '',
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [majorsRes, colorsRes] = await Promise.all([
                    fetch('/api/majors'),
                    fetch('/api/colors')
                ])
                setMajors(await majorsRes.json())
                setColors(await colorsRes.json())
            } catch (error) {
                console.error('Failed to fetch majors/colors:', error)
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (values: any) => {
        setLoading(true)
        try {
            const url = athleteId ? `/api/athletes/${athleteId}` : '/api/athletes'
            const method = athleteId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
            } else {
                toast.success(athleteId ? 'อัปเดตข้อมูลนักกีฬาสำเร็จ' : 'เพิ่มนักกีฬาสำเร็จ')
                router.back()
                router.refresh()
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Basic Info */}
                    <Card className="lg:col-span-2 glass border-none rounded-3xl overflow-hidden self-start">
                        <CardHeader className="bg-white/5 pb-8">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-indigo-500" />
                                ข้อมูลประวัตินักกีฬา
                            </CardTitle>
                            <CardDescription>ระบุชื่อและข้อมูลคณะเบื้องต้นของผู้เข้าแข่งขัน</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">ชื่อจริง</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="ภาษาไทย" className="glass h-11 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">นามสกุล</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="ภาษาไทย" className="glass h-11 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="studentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">รหัสนิสิต</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="เช่น 6401234567" className="glass h-11 rounded-xl font-mono" disabled={!!athleteId} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nickname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">ชื่อเล่น (ถ้ามี)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="เช่น ต้น" className="glass h-11 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="majorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4 opacity-50" />
                                            คณะ/สาขาวิชา
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="glass h-11 rounded-xl">
                                                    <SelectValue placeholder="เลือกสังกัดคณะ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="glass border-white/10 rounded-xl">
                                                {majors.map((major) => (
                                                    <SelectItem key={major.id} value={major.id} className="rounded-lg">
                                                        {major.name} ({major.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Team Association */}
                    <div className="space-y-6">
                        <Card className="glass border-none rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white/5 pb-8">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-pink-500" />
                                    สังกัดสีทีม
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="colorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">สีที่ลงแข่งขัน</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                                disabled={!!fixedColorId}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="glass h-11 rounded-xl">
                                                        <SelectValue placeholder="ระบุสีทีม" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="glass border-white/10 rounded-xl">
                                                    {colors.map((color) => (
                                                        <SelectItem key={color.id} value={color.id} className="rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.hexCode }} />
                                                                สี{color.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fixedColorId && (
                                                <p className="text-[10px] uppercase font-black tracking-widest text-indigo-400 mt-2">
                                                    Locked to your team
                                                </p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Card className="bg-white/5 border-dashed border-white/10 p-4 rounded-2xl">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                                            "กรุณาตรวจสอบชื่อ-นามสกุลให้ถูกต้องตามบัตรนิสิต เพื่อความถูกต้องในการสรุปผลคะแนนประจำสี"
                                        </p>
                                    </div>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" asChild className="rounded-xl h-12 px-8 font-bold">
                        <Link href="/team-manager/athletes">
                            <X className="mr-2 h-4 w-4" />
                            ยกเลิก
                        </Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-xl h-12 px-12 shadow-glow bg-indigo-600 hover:bg-indigo-500 font-black">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {athleteId ? 'บันทึกการแก้ไข' : 'ลงทะเบียนนักกีฬา'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
