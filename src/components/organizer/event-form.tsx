'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema } from '@/lib/validations'
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
import { Loader2, Save, X, Info, MapPin, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

interface EventFormProps {
    initialData?: any
    eventId?: string
}

export function EventForm({ initialData, eventId }: EventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [sportTypes, setSportTypes] = useState<any[]>([])

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: initialData ? {
            ...initialData,
            date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        } : {
            name: '',
            sportTypeId: '',
            date: '',
            time: '',
            location: '',
            status: 'UPCOMING',
        }
    })

    useEffect(() => {
        const fetchSportTypes = async () => {
            try {
                const res = await fetch('/api/sport-types')
                setSportTypes(await res.json())
            } catch (error) {
                console.error('Failed to fetch sport types:', error)
            }
        }
        fetchSportTypes()
    }, [])

    const onSubmit = async (values: any) => {
        setLoading(true)
        try {
            const url = eventId ? `/api/events/${eventId}` : '/api/events'
            const method = eventId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
            } else {
                toast.success(eventId ? 'อัปเดตรายการแข่งขันสำเร็จ' : 'สร้างรายการแข่งขันสำเร็จ')
                router.push('/organizer/events')
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
                                <Info className="h-5 w-5 text-emerald-500" />
                                ข้อมูลทั่วไปของรายการ
                            </CardTitle>
                            <CardDescription>ระบุรายละเอียดเบื้องต้นของประเภทกีฬาและชื่อรายการ</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">ชื่อรายการแข่งขัน</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="เช่น ฟุตซอล (รอบชิงชนะเลิศ)" className="glass h-12 rounded-xl text-lg font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="sportTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">ประเภทกีฬา</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="glass h-11 rounded-xl">
                                                        <SelectValue placeholder="เลือกประเภทกีฬา" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="glass border-white/10 rounded-xl">
                                                    {sportTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id} className="rounded-lg">
                                                            {type.name} ({type.category})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">สถานะการแข่งขัน</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="glass h-11 rounded-xl">
                                                        <SelectValue placeholder="ระบุสถานะ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="glass border-white/10 rounded-xl">
                                                    <SelectItem value="UPCOMING" className="rounded-lg">รอดำเนินการ</SelectItem>
                                                    <SelectItem value="ONGOING" className="rounded-lg">กำลังแข่งขัน</SelectItem>
                                                    <SelectItem value="COMPLETED" className="rounded-lg">จบการแข่งขัน</SelectItem>
                                                    <SelectItem value="CANCELLED" className="rounded-lg">ยกเลิก</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Location */}
                    <div className="space-y-6">
                        <Card className="glass border-none rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white/5 pb-8">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    เวลาและสถานที่
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold flex items-center gap-2">
                                                <Calendar className="h-3 w-3 opacity-50" />
                                                วันที่แข่งขัน
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="glass h-11 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold flex items-center gap-2">
                                                <Clock className="h-3 w-3 opacity-50" />
                                                เวลา (HH:mm)
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="09:00" className="glass h-11 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold flex items-center gap-2">
                                                <MapPin className="h-3 w-3 opacity-50" />
                                                สถานที่ (Location)
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="สนามฟุตบอล 1" className="glass h-11 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" asChild className="rounded-xl h-12 px-8 font-bold">
                        <Link href="/organizer/events">
                            <X className="mr-2 h-4 w-4" />
                            ยกเลิก
                        </Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-xl h-12 px-12 shadow-glow bg-emerald-600 hover:bg-emerald-500 font-bold">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {eventId ? 'อัปเดตข้อมูล' : 'สร้างรายการ'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
