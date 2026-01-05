"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { colorSchema, type ColorInput } from "@/lib/validations"
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
import { Loader2, Palette } from "lucide-react"

interface ColorFormProps {
    initialData?: Partial<ColorInput>
    onSubmit: SubmitHandler<ColorInput>
    isLoading?: boolean
}

export function ColorForm({
    initialData,
    onSubmit,
    isLoading = false
}: ColorFormProps) {
    const form = useForm<ColorInput>({
        resolver: zodResolver(colorSchema),
        defaultValues: {
            name: initialData?.name || "",
            hexCode: initialData?.hexCode || "#000000",
        },
    })

    const hexCode = form.watch("hexCode")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">ตัวอย่างสี</FormLabel>
                        <div
                            className="h-24 w-24 rounded-3xl border-4 border-white/10 shadow-2xl transition-transform hover:scale-110"
                            style={{ backgroundColor: hexCode }}
                        />
                    </div>

                    <div className="flex-1 space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อสี</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input placeholder="เช่น สีแดง" {...field} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hexCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">รหัสสี (HEX)</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <input type="color" {...field} className="h-12 w-20 rounded-xl glass border-white/10 p-1 cursor-pointer bg-transparent" />
                                            <Input placeholder="#EF4444" {...field} className="h-12 flex-1 rounded-xl glass border-white/10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "บันทึกการแก้ไข" : "เพิ่มสี"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
