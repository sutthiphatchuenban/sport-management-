'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema } from '@/lib/validations'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, X, Plus, Trash2, Layers } from 'lucide-react'
import Link from 'next/link'

const bulkEventSchema = z.object({
    events: z.array(eventSchema)
})

type BulkEventFormValues = z.infer<typeof bulkEventSchema>

export function BulkEventForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [sportTypes, setSportTypes] = useState<any[]>([])

    const form = useForm<BulkEventFormValues>({
        resolver: zodResolver(bulkEventSchema),
        defaultValues: {
            events: [
                {
                    name: '',
                    sportTypeId: '',
                    date: '',
                    time: '',
                    location: '',
                    status: 'UPCOMING',
                }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "events"
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

    const onSubmit = async (data: BulkEventFormValues) => {
        if (data.events.length === 0) {
            toast.error('กรุณาเพิ่มรายการแข่งขันอย่างน้อย 1 รายการ')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.events)
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
            } else {
                toast.success(`สร้างรายการแข่งขันสำเร็จจำนวน ${result.length} รายการ`)
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
                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <Layers className="h-5 w-5 text-indigo-500" />
                                สร้างหลายรายการพร้อมกัน (Bulk Create)
                            </CardTitle>
                            <CardDescription>เพิ่มรายการแข่งขันจำนวนมากในครั้งเดียว</CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({
                                name: '',
                                sportTypeId: '',
                                date: '',
                                time: '',
                                location: '',
                                status: 'UPCOMING',
                            })}
                            className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            เพิ่มแถวรายการ
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="font-bold text-white w-[50px] text-center">#</TableHead>
                                    <TableHead className="font-bold text-white min-w-[200px]">ชื่อรายการ</TableHead>
                                    <TableHead className="font-bold text-white min-w-[150px]">ประเภทกีฬา</TableHead>
                                    <TableHead className="font-bold text-white w-[150px]">วันที่</TableHead>
                                    <TableHead className="font-bold text-white w-[100px]">เวลา</TableHead>
                                    <TableHead className="font-bold text-white min-w-[150px]">สถานที่</TableHead>
                                    <TableHead className="font-bold text-white w-[140px]">สถานะ</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id} className="border-white/5 hover:bg-white/5">
                                        <TableCell className="text-center text-muted-foreground font-mono text-xs">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`events.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} placeholder="ชื่อรายการ..." className="bg-transparent border-none h-8 p-0 focus-visible:ring-0 placeholder:text-muted-foreground/50" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`events.${index}.sportTypeId`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-transparent border-none h-8 p-0 focus:ring-0">
                                                                    <SelectValue placeholder="เลือกกีฬา" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="glass border-white/10">
                                                                {sportTypes.map((type) => (
                                                                    <SelectItem key={type.id} value={type.id}>
                                                                        {type.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`events.${index}.date`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} type="date" className="bg-transparent border-none h-8 p-0 focus-visible:ring-0 text-muted-foreground" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`events.${index}.time`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} placeholder="00:00" className="bg-transparent border-none h-8 p-0 focus-visible:ring-0 font-mono text-center" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`events.${index}.location`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} placeholder="ระบุสถานที่..." className="bg-transparent border-none h-8 p-0 focus-visible:ring-0" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`events.${index}.status`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-transparent border-none h-8 p-0 focus:ring-0">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="glass border-white/10">
                                                                <SelectItem value="UPCOMING">รอดำเนินการ</SelectItem>
                                                                <SelectItem value="ONGOING">กำลังแข่งขัน</SelectItem>
                                                                <SelectItem value="COMPLETED">จบการแข่งขัน</SelectItem>
                                                                <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                                disabled={fields.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" asChild className="rounded-xl h-12 px-8 font-bold">
                        <Link href="/organizer/events">
                            <X className="mr-2 h-4 w-4" />
                            ยกเลิก
                        </Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-xl h-12 px-12 shadow-glow bg-indigo-600 hover:bg-indigo-500 font-bold">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        บันทึกทั้งหมด ({fields.length})
                    </Button>
                </div>
            </form>
        </Form>
    )
}
