'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    Plus,
    Pencil,
    Trash2,
    Trophy,
    MoreHorizontal,
    Gift
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function AwardsManagementPage() {
    const [awards, setAwards] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAward, setEditingAward] = useState<any>(null)
    const [formLoading, setFormLoading] = useState(false)

    // Form states
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [icon, setIcon] = useState('Trophy')

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/awards')
            setAwards(await res.json())
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenDialog = (award?: any) => {
        if (award) {
            setEditingAward(award)
            setName(award.name)
            setDescription(award.description || '')
            setIcon(award.icon || 'Trophy')
        } else {
            setEditingAward(null)
            setName('')
            setDescription('')
            setIcon('Trophy')
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)

        try {
            const url = editingAward ? `/api/awards/${editingAward.id}` : '/api/awards'
            const method = editingAward ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, icon })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(editingAward ? 'แก้ไขรางวัลสำเร็จ' : 'เพิ่มประเภทรางวัลสำเร็จ')
                setIsDialogOpen(false)
                fetchData()
            } else {
                toast.error(data.error || 'เกิดข้อผิดพลาด')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        } finally {
            setFormLoading(false)
        }
    }

    const deleteAward = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประเภทรางวัลนี้? จะส่งผลกระทบต่อรายการประกาศผู้ชนะ')) return

        try {
            const res = await fetch(`/api/awards/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('ลบรางวัลสำเร็จ')
                fetchData()
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
            accessorKey: 'name',
            header: 'ชื่อรางวัล',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <span className="font-bold">{row.original.name}</span>
                </div>
            )
        },
        {
            accessorKey: 'description',
            header: 'คำอธิบายรางวัล/ผลงานที่ต้องมี',
            cell: ({ row }) => <span className="text-sm text-muted-foreground line-clamp-1">{row.original.description || '-'}</span>
        },
        {
            accessorKey: '_count',
            header: 'ผู้ได้รับรางวัล',
            cell: ({ row }) => row.original._count?.winners || 0
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
                    <DropdownMenuContent align="end" className="glass border-white/10 w-40 p-2 rounded-xl">
                        <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => handleOpenDialog(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => deleteAward(row.original.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
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
                    title="จัดการรางวัล (Awards)"
                    description="บริหารจัดการหมวดหมู่รางวัลเกียรติยศสำหรับนักกีฬาและทีมสี"
                />
                <Button onClick={() => handleOpenDialog()} className="shadow-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มประเภทรางวัล
                </Button>
            </div>

            <div className="glass border-none rounded-3xl p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={awards} searchKey="name" />
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass border-white/10 rounded-3xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Gift className="h-5 w-5 text-primary" />
                            {editingAward ? 'แก้ไขรางวัล' : 'เพิ่มประเภทรางวัลใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                            ระบุชื่อรางวัลและรายละเอียดสำหรับผู้ที่จะได้รับรางวัลนี้
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-bold">ชื่อรางวัล</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="glass h-11 rounded-xl"
                                    placeholder="เช่น นักกีฬายอดเยี่ยม (MVP), ผู้เล่นทรงคุณค่า"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="font-bold">รายละเอียดเกณฑ์รางวัล</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="glass h-11 rounded-xl"
                                    placeholder="เช่น ผู้ที่ทำคะแนนสูงสุดในการแข่งขัน, ทัศนคติดีเยี่ยม"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                ยกเลิก
                            </Button>
                            <Button type="submit" disabled={formLoading} className="rounded-xl px-8 shadow-glow">
                                {formLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
