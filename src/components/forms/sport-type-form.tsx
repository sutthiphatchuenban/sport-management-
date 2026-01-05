"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sportTypeSchema, type SportTypeInput } from "@/lib/validations"
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
import { Loader2, Trophy, Users, User } from "lucide-react"

interface SportTypeFormProps {
    initialData?: Partial<SportTypeInput>
    onSubmit: SubmitHandler<SportTypeInput>
    isLoading?: boolean
}

export function SportTypeForm({
    initialData,
    onSubmit,
    isLoading = false
}: SportTypeFormProps) {
    const form = useForm<SportTypeInput>({
        resolver: zodResolver(sportTypeSchema),
        defaultValues: {
            name: initialData?.name || "",
            category: initialData?.category || "INDIVIDUAL",
            maxParticipants: initialData?.maxParticipants || 1,
            description: initialData?.description || "",
        },
    })

    const category = form.watch("category")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อประเภทกีฬา</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Trophy className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="เช่น ฟุตบอล, วิ่ง 100 เมตร" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">รูปแบบการแข่ง</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                            <div className="flex items-center gap-2">
                                                {field.value === "INDIVIDUAL" ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                                                <SelectValue placeholder="เลือกรูปแบบ" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass border-white/10 rounded-xl">
                                        <SelectItem value="INDIVIDUAL">ประเภทบุคคล (Individual)</SelectItem>
                                        <SelectItem value="TEAM">ประเภททีม (Team)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">
                                    จำนวนผู้แข่งสูงสุด ({category === "INDIVIDUAL" ? "ต่อคน" : "ต่อทีม"})
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                                        className="h-12 rounded-xl glass border-white/10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">รายละเอียดกติกาเบื้องต้น</FormLabel>
                                <FormControl>
                                    <Input placeholder="ระบุรายละเอียด..." {...field} className="h-12 rounded-xl glass border-white/10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "บันทึกการแก้ไข" : "เพิ่มประเภทกีฬา"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
