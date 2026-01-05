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
    Palette,
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
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function ColorsManagementPage() {
    const [colors, setColors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingColor, setEditingColor] = useState<any>(null)
    const [formLoading, setFormLoading] = useState(false)

    // Form states
    const [name, setName] = useState('')
    const [hexCode, setHexCode] = useState('#000000')

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/colors')
            setColors(await res.json())
        } catch (error) {
            toast.error('ไม่สามารถดึงข้อมูลได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenDialog = (color?: any) => {
        if (color) {
            setEditingColor(color)
            setName(color.name)
            setHexCode(color.hexCode)
        } else {
            setEditingColor(null)
            setName('')
            setHexCode('#000000')
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)

        try {
            const url = editingColor ? `/api/colors/${editingColor.id}` : '/api/colors'
            const method = editingColor ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, hexCode })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(editingColor ? 'แก้ไขสีสำเร็จ' : 'เพิ่มสีสำเร็จ')
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

    const deleteColor = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสีนี้? หากลบคะแนนและข้อมูลของทีมจะหายไป')) return

        try {
            const res = await fetch(`/api/colors/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (res.ok) {
                toast.success('ลบสีสำเร็จ')
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
            accessorKey: 'hexCode',
            header: 'สี',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: row.original.hexCode }} />
                    <code className="text-xs font-mono opacity-50 uppercase">{row.original.hexCode}</code>
                </div>
            )
        },
        {
            accessorKey: 'name',
            header: 'ชื่อทีมสี',
            cell: ({ row }) => <span className="font-bold text-lg">สี{row.original.name}</span>
        },
        {
            accessorKey: '_count',
            header: 'สถิติการใช้งาน',
            cell: ({ row }) => (
                <div className="flex gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{row.original._count?.majors || 0} สาขา</span>
                    <span>{row.original._count?.athletes || 0} นักกีฬา</span>
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
                    <DropdownMenuContent align="end" className="glass border-white/10 w-40 p-2 rounded-xl">
                        <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => handleOpenDialog(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => deleteColor(row.original.id)}
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
                    title="จัดการทีมสี"
                    description="จัดการทีมพาร์ทิชันสีหลักสำหรับการแข่งขันและการสะสมแต้ม"
                />
                <Button onClick={() => handleOpenDialog()} className="shadow-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มทีมสี
                </Button>
            </div>

            <div className="glass border-none rounded-3xl p-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={colors} searchKey="name" />
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass border-white/10 rounded-3xl max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            {editingColor ? 'แก้ไขข้อมูลสี' : 'เพิ่มทีมสีใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                            กำหนดชื่อเรียกและรหัสสี (Hex Code) สำหรับการแสดงผลในระบบ
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-bold">ชื่อสี (ภาษาไทย)</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="glass h-11 rounded-xl"
                                    placeholder="เช่น ชมพู, เขียว, เหลือง"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hex" className="font-bold">รหัสสี (HEX)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        id="colorPicker"
                                        value={hexCode}
                                        onChange={(e) => setHexCode(e.target.value)}
                                        className="w-12 h-11 p-1 bg-transparent border-white/10 rounded-xl cursor-pointer"
                                    />
                                    <Input
                                        id="hex"
                                        value={hexCode}
                                        onChange={(e) => setHexCode(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                                        className="glass h-11 rounded-xl flex-1 font-mono uppercase"
                                        placeholder="#000000"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Preview Area */}
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-4">
                                <div className="h-12 w-12 rounded-full shadow-2xl" style={{ backgroundColor: hexCode }} />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">สี{name || 'ตัวอย่าง'}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">{hexCode}</p>
                                </div>
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
