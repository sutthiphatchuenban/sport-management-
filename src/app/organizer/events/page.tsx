'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    Plus,
    MoreHorizontal,
    Trophy,
    Users,
    Clock,
    CheckCircle2,
    Calendar,
    Pencil,
    Trash2
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { toast } from 'sonner'

export default function EventsManagementPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/events')
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลรายการแข่งขันได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const deleteEvent = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการแข่งขันนี้? ข้อมูลการสมัครและผลจะถูกลบไปด้วย')) return

        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('ลบรายการแข่งขันสำเร็จ')
                fetchEvents()
            } else {
                const data = await res.json()
                toast.error(data.error || 'ไม่สามารถลบได้')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'date',
            header: 'วันเวลา',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{format(new Date(row.original.date), 'dd MMM yyyy', { locale: th })}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {row.original.time} น.
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'name',
            header: 'ชื่อรายการ',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold">{row.original.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{row.original.sportType.name}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'สถานะ',
            cell: ({ row }) => {
                const status = row.original.status
                switch (status) {
                    case 'UPCOMING': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-none px-3 font-bold">รอดำเนินการ</Badge>
                    case 'ONGOING': return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-none px-3 font-bold animate-pulse">กำลังแข่ง</Badge>
                    case 'COMPLETED': return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-3 font-bold">จบแล้ว</Badge>
                    default: return <Badge variant="outline">{status}</Badge>
                }
            }
        },
        {
            accessorKey: '_count',
            header: 'สถิติ',
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold flex items-center gap-1">
                        <Users className="h-3 w-3 opacity-40" />
                        {row.original._count.registrations} นักกีฬา
                    </span>
                    {row.original._count.results > 0 && (
                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="h-2 w-2" />
                            ลงผลแล้ว
                        </span>
                    )}
                </div>
            )
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass border-white/10 w-48 p-2 rounded-xl">
                        <DropdownMenuItem className="rounded-lg cursor-pointer font-bold" asChild>
                            <Link href={`/organizer/events/${row.original.id}`}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                                บันทึกผล/จัดการ
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer" asChild>
                            <Link href={`/organizer/events/${row.original.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                แก้ไขรายละเอียด
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => deleteEvent(row.original.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบรายการ
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
                    title="จัดการรายการแข่งขัน"
                    description="ตรวจสอบสถานะ บันทึกผลการแข่งขัน และจัดการรายละเอียดสนามกีฬา"
                />
                <Button asChild className="shadow-glow bg-emerald-600 hover:bg-emerald-500">
                    <Link href="/organizer/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มรายการแข่งขัน
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
                        data={events}
                        searchKey="name"
                        searchPlaceholder="ค้นหาตามชื่อกิจกรรม..."
                    />
                )}
            </div>
        </div>
    )
}
