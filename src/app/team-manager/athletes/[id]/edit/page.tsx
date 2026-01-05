'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { AthleteForm } from '@/components/team/athlete-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditAthletePage() {
    const params = useParams()
    const { data: session } = useSession()
    const [athlete, setAthlete] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAthlete = async () => {
            try {
                const res = await fetch(`/api/athletes/${params.id}`)
                const data = await res.json()
                setAthlete(data)
            } catch (error) {
                console.error('Failed to fetch athlete:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAthlete()
    }, [params.id])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/team-manager/athletes">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title="แก้ไขข้อมูลนักกีฬา"
                    description="ปรับปรุงข้อมูลประวัติหรือคณะของนักกีฬาในทีม"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-[500px] rounded-3xl" />
                    <Skeleton className="h-[300px] rounded-3xl" />
                </div>
            ) : athlete ? (
                <AthleteForm
                    initialData={athlete}
                    athleteId={athlete.id}
                    fixedColorId={session?.user?.role === 'TEAM_MANAGER' ? session?.user?.colorId : undefined}
                />
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-muted-foreground">ไม่พบข้อมูลนักกีฬา</p>
                </div>
            )}
        </div>
    )
}
