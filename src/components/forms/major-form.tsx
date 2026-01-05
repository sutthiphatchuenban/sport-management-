"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { majorSchema, type MajorInput } from "@/lib/validations"
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
import { Loader2, Building2, Hash, Palette } from "lucide-react"

interface MajorFormProps {
    initialData?: Partial<MajorInput>
    onSubmit: SubmitHandler<MajorInput>
    isLoading?: boolean
    colors?: { id: string; name: string }[]
}

export function MajorForm({
    initialData,
    onSubmit,
    isLoading = false,
    colors = []
}: MajorFormProps) {
    const form = useForm<MajorInput>({
        resolver: zodResolver(majorSchema),
        defaultValues: {
            name: initialData?.name || "",
            code: initialData?.code || "",
            colorId: initialData?.colorId || undefined,
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
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อสาขา</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="เช่น เทคโนโลยีดิจิทัล" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">รหัสสาขา</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="เช่น DT" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colorId"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">สีที่สังกัด (ถ้ามี)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Palette className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="เลือกสีที่สังกัด" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass border-white/10 rounded-xl">
                                        {colors.map((color) => (
                                            <SelectItem key={color.id} value={color.id}>สี{color.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "บันทึกการแก้ไข" : "เพิ่มสาขา"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
