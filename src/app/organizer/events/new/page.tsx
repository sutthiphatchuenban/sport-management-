'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { EventForm } from '@/components/organizer/event-form'
import { BulkEventForm } from '@/components/organizer/bulk-event-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Layers, Plus } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function NewEventPage() {
    const [isBulkMode, setIsBulkMode] = useState(false)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href="/organizer/events">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isBulkMode ? "สร้างหลายรายการ (Bulk Create)" : "สร้างรายการแข่งขันใหม่"}
                        description="กำหนดรายละเอียดการแข่งขันสำหรับกีฬาต่างๆ"
                    />
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
                    <Button
                        variant={!isBulkMode ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setIsBulkMode(false)}
                        className={`rounded-xl px-4 transition-all ${!isBulkMode ? 'shadow-lg font-bold' : 'text-muted-foreground'}`}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        แบบรายการเดียว
                    </Button>
                    <Button
                        variant={isBulkMode ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setIsBulkMode(true)}
                        className={`rounded-xl px-4 transition-all ${isBulkMode ? 'shadow-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white' : 'text-muted-foreground'}`}
                    >
                        <Layers className="mr-2 h-4 w-4" />
                        แบบหลายรายการ
                    </Button>
                </div>
            </div>

            {isBulkMode ? <BulkEventForm /> : <EventForm />}
        </div>
    )
}
