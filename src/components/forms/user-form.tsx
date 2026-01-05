"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, type CreateUserInput } from "@/lib/validations"
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

interface UserFormProps {
    initialData?: Partial<CreateUserInput>
    onSubmit: SubmitHandler<CreateUserInput>
    isLoading?: boolean
    majors?: { id: string; name: string }[]
    colors?: { id: string; name: string }[]
}

export function UserForm({
    initialData,
    onSubmit,
    isLoading = false,
    majors = [],
    colors = []
}: UserFormProps) {
    const form = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: initialData?.username || "",
            email: initialData?.email || "",
            password: "",
            role: initialData?.role || "VIEWER",
            majorId: initialData?.majorId || undefined,
            colorId: initialData?.colorId || undefined,
        },
    })

    const role = form.watch("role")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">ชื่อผู้ใช้งาน</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin" {...field} className="h-12 rounded-xl glass border-white/10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">อีเมล</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin@example.com" {...field} className="h-12 rounded-xl glass border-white/10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">รหัสผ่าน</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-xl glass border-white/10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">บทบาท</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                            <SelectValue placeholder="เลือกบทบาท" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass border-white/10 rounded-xl">
                                        <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                                        <SelectItem value="ORGANIZER">สโมสรนิสิต</SelectItem>
                                        <SelectItem value="TEAM_MANAGER">ตัวแทนสาขา</SelectItem>
                                        <SelectItem value="VIEWER">ผู้ชมทั่วไป</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {role === "TEAM_MANAGER" && (
                        <>
                            <FormField
                                control={form.control}
                                name="majorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">สาขา</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
                        </>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "อัปเดตข้อมูล" : "สร้างผู้ใช้งาน"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
