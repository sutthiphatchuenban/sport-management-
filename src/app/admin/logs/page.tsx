'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import {
    History,
    User,
    Activity,
    Clock,
    Monitor
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLE_LABELS } from '@/lib/constants'

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/logs?limit=50')
            const data = await res.json()
            setLogs(data.logs || [])
        } catch (error) {
            console.error('Failed to fetch logs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
            case 'UPDATE': return 'text-amber-500 border-amber-500/20 bg-amber-500/5'
            case 'DELETE': return 'text-rose-500 border-rose-500/20 bg-rose-500/5'
            case 'LOGIN': return 'text-blue-500 border-blue-500/20 bg-blue-500/5'
            case 'LOGOUT': return 'text-slate-500 border-slate-500/20 bg-slate-500/5'
            default: return ''
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'createdAt',
            header: 'วันเวลาที่เกิดรายการ',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs font-bold whitespace-nowrap">
                    <Clock className="h-3 w-3 opacity-40" />
                    {format(new Date(row.original.createdAt), 'dd MMM yyyy HH:mm:ss', { locale: th })}
                </div>
            )
        },
        {
            accessorKey: 'user',
            header: 'ผู้ดำเนินการ',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="h-4 w-4 opacity-50" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">@{row.original.user?.username || 'System'}</span>
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                            {ROLE_LABELS[row.original.user?.role as keyof typeof ROLE_LABELS] || 'Unknown'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'action',
            header: 'รายการที่ทำ',
            cell: ({ row }) => (
                <Badge variant="outline" className={getActionColor(row.original.action)}>
                    <Activity className="mr-1 h-3 w-3" />
                    {row.original.action}
                </Badge>
            )
        },
        {
            accessorKey: 'tableName',
            header: 'ข้อมูลที่แก้ไข',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest opacity-40">{row.original.tableName || '-'}</span>
                    <span className="text-[10px] font-mono opacity-60">ID: {row.original.recordId || '-'}</span>
                </div>
            )
        },
        {
            accessorKey: 'ipAddress',
            header: 'ที่อยู่ IP',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 opacity-50">
                    <Monitor className="h-3 w-3" />
                    <span className="text-[10px] font-mono">{row.original.ipAddress || 'unknown'}</span>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="ประวัติการใช้งานระบบ (Audit Logs)"
                description="ตรวจสอบประวัติการทำรายการย้อนหลังทั้งหมดของผู้ดูแลระบบและทีมผู้จัดงาน"
            />

            <div className="glass border-none rounded-3xl p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={logs}
                        searchKey="action"
                        searchPlaceholder="ค้นหาตามประเภทรายการ..."
                    />
                )}
            </div>
        </div>
    )
}
