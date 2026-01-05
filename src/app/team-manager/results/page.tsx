'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
    Trophy,
    Medal,
    Calendar,
    User,
    TrendingUp,
    Download,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import Link from 'next/link'

export default function TeamResultsPage() {
    const { data: session } = useSession()
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            if (!session?.user?.colorId) return
            try {
                const res = await fetch('/api/team-manager/stats')
                const data = await res.json()
                setResults(data.recentResults || [])
            } catch (error) {
                console.error('Failed to fetch results:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [session])

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'event',
            header: 'รายการแข่งขัน',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold">{row.original.event.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mt-1">
                        {row.original.event.sportType.name}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'athlete',
            header: 'นักกีฬา',
            cell: ({ row }) => row.original.athlete ? (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <User className="h-3 w-3 text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium">{row.original.athlete.firstName} ({row.original.athlete.nickname})</span>
                </div>
            ) : <span className="text-muted-foreground italic text-xs">ประเภททีม</span>
        },
        {
            accessorKey: 'rank',
            header: 'อันดับ',
            cell: ({ row }) => {
                const rank = row.original.rank
                return (
                    <div className={`
                        inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px]
                        ${rank === 1 ? 'bg-amber-500/10 text-amber-500' :
                            rank === 2 ? 'bg-slate-300/10 text-slate-300' :
                                rank === 3 ? 'bg-amber-800/10 text-amber-800' :
                                    'bg-white/5 text-muted-foreground'}
                    `}>
                        <Medal className="h-3 w-3" />
                        อันดับ {rank}
                    </div>
                )
            }
        },
        {
            accessorKey: 'points',
            header: 'คะแนนที่ทีมได้รับ',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-emerald-400">+{row.original.points}</span>
                    <span className="text-[10px] font-bold opacity-30 mt-1">PTS</span>
                </div>
            )
        },
        {
            accessorKey: 'recordedAt',
            header: 'วันเวลา',
            cell: ({ row }) => (
                <div className="flex flex-col opacity-60">
                    <span className="text-xs font-bold">{format(new Date(row.original.recordedAt), 'd MMM yyyy', { locale: th })}</span>
                    <span className="text-[10px] font-medium">{format(new Date(row.original.recordedAt), 'HH:mm น.')}</span>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="สรุปผลการแข่งขันของทีม"
                    description="ตรวจสอบประวัติผลงานและอันดับที่นักกีฬาในสังกัดของคุณคว้ามาได้"
                />
                <Button variant="outline" className="rounded-xl glass border-white/10 h-12 px-6 font-bold">
                    <Download className="mr-2 h-4 w-4" />
                    ดาวน์โหลดสรุปผล
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'คะแนนรวมปัจจุบัน', value: results.reduce((acc, curr) => acc + curr.points, 0), icon: Trophy, color: 'text-amber-500' },
                    { label: 'สถิติอันดับที่ 1', value: results.filter(r => r.rank === 1).length, icon: Medal, color: 'text-emerald-500' },
                    { label: 'สถิติอันดับที่ 2-3', value: results.filter(r => r.rank === 2 || r.rank === 3).length, icon: Medal, color: 'text-slate-400' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none rounded-3xl overflow-hidden">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <h3 className="text-3xl font-black">{stat.value}</h3>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
                        data={results}
                        searchKey="event_name" // Note: DataTable might need custom logic for nested keys, or we flatten
                        searchPlaceholder="ค้นหาตามชื่อรายการ..."
                    />
                )}
            </div>
        </div>
    )
}
