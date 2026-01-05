'use client'

import { PageHeader } from '@/components/shared/page-header'
import { UserForm } from '@/components/admin/user-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewUserPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/admin/users">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title="เพิ่มผู้ใช้งานใหม่"
                    description="สร้างบัญชีผู้ใช้ใหม่สำหรับทีมผู้จัดงานหรือหัวหน้าสี"
                />
            </div>

            <UserForm />
        </div>
    )
}
