'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, updateUserSchema } from '@/lib/validations'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ROLE_LABELS } from '@/lib/constants'
import { Loader2, Save, X } from 'lucide-react'
import Link from 'next/link'

interface UserFormProps {
    initialData?: any
    userId?: string
}

export function UserForm({ initialData, userId }: UserFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [majors, setMajors] = useState<any[]>([])
    const [colors, setColors] = useState<any[]>([])

    const form = useForm({
        resolver: zodResolver(userId ? updateUserSchema : createUserSchema),
        defaultValues: initialData || {
            username: '',
            password: '',
            email: '',
            role: 'TEAM_MANAGER',
            majorId: undefined,
            colorId: undefined,
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
                console.error('Failed to fetch master data:', error)
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (values: any) => {
        setLoading(true)
        try {
            const url = userId ? `/api/users/${userId}` : '/api/users'
            const method = userId ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
            } else {
                toast.success(userId ? 'อัปเดตข้อมูลสำเร็จ' : 'สร้างผู้ใช้งานสำเร็จ')
                router.push('/admin/users')
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
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            ข้อมูลบัญชีผู้ใช้งาน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">ชื่อผู้ใช้งาน (Username)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="เช่น admin_it" className="glass h-11 rounded-xl" />
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
                                    <FormLabel className="font-bold">อีเมล (Email)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="example@it.msu.ac.th" className="glass h-11 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!userId && (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">รหัสผ่าน (Password)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" placeholder="ระบุรหัสผ่าน 6 หลักขึ้นไป" className="glass h-11 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">บทบาทผู้ใช้งาน</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="glass h-11 rounded-xl">
                                                <SelectValue placeholder="เลือกบทบาท" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="glass border-white/10 rounded-xl">
                                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value} className="rounded-lg">
                                                    {label}
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

                <Card className="glass border-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white/5 pb-8">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-pink-500" />
                            สังกัดและสถานะ (เลือกได้ตามบทบาท)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">สีประจำทีม</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="glass h-11 rounded-xl">
                                                <SelectValue placeholder="ไม่ต้องระบุ (ถ้าไม่ใช่ Team Manager)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="glass border-white/10 rounded-xl">
                                            <SelectItem value="none" className="rounded-lg italic opacity-50">ไม่ใช่ตัวแทนสี</SelectItem>
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
                                    <FormDescription className="text-[10px] uppercase">ระบุเฉพาะทีมสต๊าฟสี</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="majorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">สาขาวิชา</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="glass h-11 rounded-xl">
                                                <SelectValue placeholder="เลือกสาขา" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="glass border-white/10 rounded-xl">
                                            <SelectItem value="none" className="rounded-lg italic opacity-50">ไม่ระบุ</SelectItem>
                                            {majors.map((major) => (
                                                <SelectItem key={major.id} value={major.id} className="rounded-lg">
                                                    {major.name}
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

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" asChild className="rounded-xl h-12 px-8">
                        <Link href="/admin/users">
                            <X className="mr-2 h-4 w-4" />
                            ยกเลิก
                        </Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-xl h-12 px-10 shadow-glow">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {userId ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
