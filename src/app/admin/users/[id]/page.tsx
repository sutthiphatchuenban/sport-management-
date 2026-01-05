'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { UserForm } from '@/components/admin/user-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditUserPage() {
    const params = useParams()
    const id = params.id as string
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users`)
                const data = await res.json()
                const userData = data.users.find((u: any) => u.id === id)

                // Clean up data for form
                if (userData) {
                    const cleanedData = {
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        majorId: userData.majorId || 'none',
                        colorId: userData.colorId || 'none'
                    }
                    setUser(cleanedData)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [id])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/admin/users">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title="แก้ไขข้อมูลผู้ใช้"
                    description="อัปเดตข้อมูล สิทธิ์การใช้งาน หรือสังกัดของผู้ใช้งาน"
                />
            </div>

            {loading ? (
                <div className="space-y-6">
                    <Skeleton className="h-[300px] w-full rounded-3xl" />
                    <Skeleton className="h-[200px] w-full rounded-3xl" />
                </div>
            ) : user ? (
                <UserForm initialData={user} userId={id} />
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    ไม่พบข้อมูลผู้ใช้งาน
                </div>
            )}
        </div>
    )
}
