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
    GraduationCap,
    MoreHorizontal
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function MajorsManagementPage() {
    const [majors, setMajors] = useState<any[]>([])
    const [colors, setColors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMajor, setEditingMajor] = useState<any>(null)
    const [formLoading, setFormLoading] = useState(false)

    // Form states
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [colorId, setColorId] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const [majorsRes, colorsRes] = await Promise.all([
                fetch('/api/majors'),
                fetch('/api/colors')
            ])
            setMajors(await majorsRes.json())
            setColors(await colorsRes.json())
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenDialog = (major?: any) => {
        if (major) {
            setEditingMajor(major)
            setName(major.name)
            setCode(major.code)
            setColorId(major.colorId || '')
        } else {
            setEditingMajor(null)
            setName('')
            setCode('')
            setColorId('')
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)

        try {
            const url = editingMajor ? `/api/majors/${editingMajor.id}` : '/api/majors'
            const method = editingMajor ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, code, colorId: colorId || null })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(editingMajor ? 'แก้ไขสาขาสำเร็จ' : 'เพิ่มสาขาสำเร็จ')
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

    const deleteMajor = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสาขาวิชานี้?')) return

        try {
            const res = await fetch(`/api/majors/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (res.ok) {
                toast.success('ลบสาขาวิชาสำเร็จ')
                fetchData()
            } else {
                toast.error(data.error || 'ไม่สามารถลบได้')
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'code',
            header: 'รหัสสาขา',
            cell: ({ row }) => <code className="bg-white/5 px-2 py-1 rounded font-mono text-xs">{row.original.code}</code>
        },
        {
            accessorKey: 'name',
            header: 'ชื่อสาขาวิชา',
            cell: ({ row }) => <span className="font-bold">{row.original.name}</span>
        },
        {
            accessorKey: 'color',
            header: 'สีที่สังกัด',
            cell: ({ row }) => {
                const color = row.original.color
                if (!color) return <span className="text-muted-foreground italic text-xs">ไม่ได้ระบุ</span>
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.hexCode }} />
                        <span className="text-sm">สี{color.name}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: '_count',
            header: 'จำนวนนักกีฬา',
            cell: ({ row }) => row.original._count.athletes
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
                            onClick={() => deleteMajor(row.original.id)}
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
                    title="จัดการสาขาวิชา"
                    description="จัดการข้อมูลหลักของสาขาวิชาภายในคณะและการสังกัดสีทีม"
                />
                <Button onClick={() => handleOpenDialog()} className="shadow-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มสาขาวิชา
                </Button>
            </div>

            <div className="glass border-none rounded-3xl p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={majors} searchKey="name" />
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass border-white/10 rounded-3xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            {editingMajor ? 'แก้ไขสาขาวิชา' : 'เพิ่มสาขาวิชาใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                            กรอกข้อมูลรายละเอียดของสาขาวิชาและการสังกัดสีประจำทีม
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="font-bold">รหัสสาขา</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="glass h-11 rounded-xl"
                                    placeholder="เช่น CS, IT, GIS"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-bold">ชื่อสาขาวิชา</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="glass h-11 rounded-xl"
                                    placeholder="ชื่อเต็มของสาขาวิชา"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">สีที่สังกัด</Label>
                                <Select onValueChange={setColorId} value={colorId}>
                                    <SelectTrigger className="glass h-11 rounded-xl">
                                        <SelectValue placeholder="เลือกทีมสี" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10 rounded-xl">
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
