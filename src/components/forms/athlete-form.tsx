"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { athleteSchema, type AthleteInput } from "@/lib/validations"
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
import { Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/shared/image-upload"

interface AthleteFormProps {
    initialData?: Partial<AthleteInput>
    onSubmit: (data: AthleteInput) => void
    isLoading?: boolean
    majors: { id: string; name: string }[]
    colors: { id: string; name: string }[]
}

export function AthleteForm({
    initialData,
    onSubmit,
    isLoading = false,
    majors,
    colors
}: AthleteFormProps) {
    const form = useForm<AthleteInput>({
        resolver: zodResolver(athleteSchema),
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            nickname: initialData?.nickname || "",
            studentId: initialData?.studentId || "",
            majorId: initialData?.majorId || "",
            colorId: initialData?.colorId || "",
            photoUrl: initialData?.photoUrl || "",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 flex justify-center">
                        <FormField
                            control={form.control}
                            name="photoUrl"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value ?? undefined}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                            label="รูปถ่ายนักกีฬา"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex-1 grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อจริง</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl glass border-white/10" />
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
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">นามสกุล</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl glass border-white/10" />
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
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อเล่น</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl glass border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">รหัสนิสิต</FormLabel>
                                    <FormControl>
                                        <Input placeholder="6401..." {...field} className="h-12 rounded-xl glass border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="majorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">สาขา</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                                <SelectValue placeholder="เลือกสาขา" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="glass border-white/10 rounded-xl">
                                            {majors.map((major) => (
                                                <SelectItem key={major.id} value={major.id}>{major.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">สีที่สังกัด</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                                <SelectValue placeholder="เลือกสี" />
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
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "บันทึกการแก้ไข" : "เพิ่มนักกีฬา"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
