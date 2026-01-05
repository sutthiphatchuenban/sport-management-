'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { Trophy, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/theme-toggle'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true)
        try {
            const result = await signIn('credentials', {
                username: data.username,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                toast.error('เข้าสู่ระบบไม่สำเร็จ', {
                    description: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                })
            } else {
                toast.success('เข้าสู่ระบบสำเร็จ', {
                    description: 'กำลังพาท่านไปยังหน้าแดชบอร์ด...',
                })
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด', {
                description: 'กรุณาลองใหม่อีกครั้งในภายหลัง',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-none glass shadow-2xl">
            <CardHeader className="space-y-4 pt-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow">
                    <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-3xl font-black tracking-tighter">เข้าสู่ระบบ</CardTitle>
                    <CardDescription className="text-base">
                        สำหรับผู้ดูแลระบบและคณะกรรมการจัดการแข่งขัน
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            ชื่อผู้ใช้งาน
                        </label>
                        <Input
                            {...register('username')}
                            placeholder="admin / manager_it"
                            className="h-12 rounded-xl bg-background/50 border-white/10 focus:ring-primary/50"
                        />
                        {errors.username && (
                            <p className="text-xs font-medium text-destructive ml-1">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            รหัสผ่าน
                        </label>
                        <div className="relative">
                            <Input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="h-12 rounded-xl bg-background/50 border-white/10 pr-12 focus:ring-primary/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs font-medium text-destructive ml-1">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-xl py-6 text-lg font-bold shadow-glow"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            'เข้าสู่ระบบ'
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground font-medium">
                            หรือติดต่อผู้ดูแลระบบ
                        </span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                    ยังไม่มีบัญชี? <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">สมัครสมาชิกใหม่</Link>
                </p>
            </CardFooter>
        </Card>
    )
}

function LoginFormFallback() {
    return (
        <Card className="border-none glass shadow-2xl">
            <CardHeader className="space-y-4 pt-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow">
                    <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-3xl font-black tracking-tighter">เข้าสู่ระบบ</CardTitle>
                    <CardDescription className="text-base">
                        กำลังโหลด...
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="z-10 w-full max-w-md">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    กลับเข้าสู่หน้าหลัก
                </Link>

                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>

                <p className="mt-8 text-center text-xs text-muted-foreground/50 font-medium">
                    © 2024 IT Sport Management System. All rights reserved.
                </p>
            </div>
        </div>
    )
}
