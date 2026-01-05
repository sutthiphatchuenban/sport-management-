'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import {
    UserPlus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Lock,
    Unlock,
    Shield
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { toast } from 'sonner'
import { ROLE_LABELS } from '@/lib/constants'

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users?limit=100')
            const data = await res.json()
            setUsers(data.users || [])
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลผู้ใช้งานได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })
            if (res.ok) {
                toast.success('อัปเดตสถานะสำเร็จ')
                fetchUsers()
            } else {
                toast.error('เกิดข้อผิดพลาดในการอัปเดต')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        }
    }

    const deleteUser = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?')) return

        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('ลบผู้ใช้งานสำเร็จ')
                fetchUsers()
            } else {
                toast.error('เกิดข้อผิดพลาดในการลบ')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'username',
            header: 'ผู้ใช้งาน',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold">@{row.original.username}</span>
                    <span className="text-xs text-muted-foreground">{row.original.email}</span>
                </div>
            )
        },
        {
            accessorKey: 'role',
            header: 'บทบาท',
            cell: ({ row }) => {
                const role = row.original.role
                return (
                    <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-md font-bold">
                        <Shield className="mr-1 h-3 w-3" />
                        {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
                    </Badge>
                )
            }
        },
        {
            accessorKey: 'color',
            header: 'ทีมสี',
            cell: ({ row }) => {
                const color = row.original.color
                if (!color) return <span className="text-muted-foreground italic text-xs">ทั่วไป</span>
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.hexCode }} />
                        <span className="text-sm font-bold">สี{color.name}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: 'major',
            header: 'สาขาวิชา',
            cell: ({ row }) => row.original.major?.name || '-'
        },
        {
            accessorKey: 'isActive',
            header: 'สถานะ',
            cell: ({ row }) => (
                <Badge
                    variant={row.original.isActive ? 'outline' : 'destructive'}
                    className={row.original.isActive ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : ''}
                >
                    {row.original.isActive ? 'ปกติ' : 'ถูกระงับ'}
                </Badge>
            )
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-white/10 w-48 p-2 rounded-xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 py-1.5">จัดการผู้ใช้</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href={`/admin/users/${user.id}`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    แก้ไขข้อมูล
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-lg cursor-pointer"
                                onClick={() => toggleUserStatus(user.id, user.isActive)}
                            >
                                {user.isActive ? (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        ระงับการใช้งาน
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="mr-2 h-4 w-4" />
                                        ปลดระงับ
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5 my-1" />
                            <DropdownMenuItem
                                className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => deleteUser(user.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบผู้ใช้งาน
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="จัดการผู้ใช้งาน"
                    description="จัดการสิทธิ์การเข้าถึง บัญชีผู้ดูแลระบบ และทีมผู้จัดงาน"
                />
                <Button asChild className="shadow-glow">
                    <Link href="/admin/users/new">
                        <UserPlus className="mr-2 h-4 w-4" />
                        เพิ่มผู้ใช้งานใหม่
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
                        data={users}
                        searchKey="username"
                        searchPlaceholder="ค้นหาตามชื่อผู้ใช้งานหรืออีเมล..."
                    />
                )}
            </div>
        </div>
    )
}
