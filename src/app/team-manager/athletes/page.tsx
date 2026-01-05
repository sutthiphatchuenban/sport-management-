'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
    Users,
    UserPlus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { toast } from 'sonner'

export default function TeamAthletesPage() {
    const { data: session } = useSession()
    const [athletes, setAthletes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAthletes = async () => {
        if (!session?.user?.colorId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/athletes?colorId=${session.user.colorId}&limit=100`)
            const data = await res.json()
            setAthletes(data.athletes || [])
        } catch (error) {
            toast.error('ไม่สามารถโหลดข้อมูลนักกีฬาได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAthletes()
    }, [session])

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'firstName',
            header: 'ชื่อ-นามสกุล',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold">{row.original.firstName} {row.original.lastName}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mt-1">
                        {row.original.nickname ? `"${row.original.nickname}"` : '-'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'studentId',
            header: 'รหัสนิสิต',
            cell: ({ row }) => <span className="font-mono text-sm opacity-60">{row.original.studentId}</span>
        },
        {
            accessorKey: 'major',
            header: 'คณะ/สาขา',
            cell: ({ row }) => (
                <Badge variant="outline" className="border-white/10 opacity-70 rounded-md font-bold text-[10px]">
                    {row.original.major.name}
                </Badge>
            )
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-white/5">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass border-white/10 rounded-xl">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40">Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/team-manager/athletes/${row.original.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" /> ดูข้อมูลผลงงาน
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/team-manager/athletes/${row.original.id}/edit`} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" /> แก้ไขข้อมูล
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="รายชื่อนักกีฬาในทีม"
                    description="จัดการและตรวจสอบข้อมูลนักกีฬาที่สังกัดสีของคุณ"
                />
                <Button className="rounded-xl shadow-glow bg-indigo-600 hover:bg-indigo-500 font-bold h-12 px-6" asChild>
                    <Link href="/team-manager/athletes/new">
                        <UserPlus className="mr-2 h-5 w-5" />
                        เพิ่มนักกีฬา
                    </Link>
                </Button>
            </div>

            <div className="glass border-none rounded-3xl p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={athletes}
                        searchKey="firstName"
                        searchPlaceholder="ค้นหาตามชื่อนักกีฬา..."
                    />
                )}
            </div>
        </div>
    )
}
