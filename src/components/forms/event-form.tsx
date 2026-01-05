"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventSchema, type EventInput } from "@/lib/validations"
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
import { Loader2, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react"



interface EventFormProps {
    initialData?: Partial<EventInput>
    onSubmit: SubmitHandler<EventInput>
    isLoading?: boolean
    sportTypes: { id: string; name: string }[]
}

export function EventForm({
    initialData,
    onSubmit,
    isLoading = false,
    sportTypes
}: EventFormProps) {
    const form = useForm<EventInput>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            sportTypeId: initialData?.sportTypeId || "",
            name: initialData?.name || "",
            date: initialData?.date || "",
            time: initialData?.time || "",
            location: initialData?.location || "",
            status: initialData?.status || "UPCOMING",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อรายการแข่งขัน</FormLabel>
                                <FormControl>
                                    <Input placeholder="เช่น กรีฑา 100 เมตร (ชาย)" {...field} className="h-12 rounded-xl glass border-white/10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sportTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ประเภทกีฬา</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                            <SelectValue placeholder="เลือกประเภทกีฬา" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass border-white/10 rounded-xl">
                                        {sportTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
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
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">สถานะ</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                            <SelectValue placeholder="เลือกสถานะ" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass border-white/10 rounded-xl">
                                        <SelectItem value="UPCOMING">เตรียมการ</SelectItem>
                                        <SelectItem value="ONGOING">กำลังแข่งขัน</SelectItem>
                                        <SelectItem value="COMPLETED">เสร็จสิ้น</SelectItem>
                                        <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">วันที่แข่งขัน</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="date" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                    </div>
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
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">เวลาแข่งขัน</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="HH:mm" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">สถานที่</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="เช่น สนามกีฬากลาง" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "บันทึกการแก้ไข" : "สร้างรายการแข่ง"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
