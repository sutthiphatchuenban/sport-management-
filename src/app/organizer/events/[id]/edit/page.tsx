'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { EventForm } from '@/components/organizer/event-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditEventPage() {
    const params = useParams()
    const id = params.id as string
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${id}`)
                const data = await res.json()
                setEvent(data)
            } catch (error) {
                console.error('Failed to fetch event:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvent()
    }, [id])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/organizer/events">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title="แก้ไขข้อมูลการแข่งขัน"
                    description="อัปเดตรายละเอียด สถานะ หรือสถานที่จัดการแข่งขันให้เป็นปัจจุบัน"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-3xl" />
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            ) : event ? (
                <EventForm initialData={event} eventId={id} />
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    ไม่พบข้อมูลรายการแข่งขัน
                </div>
            )}
        </div>
    )
}
