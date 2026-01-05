'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { AthleteCard } from '@/components/shared/athlete-card'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Vote, ChevronLeft, Info, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function EventVotingPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.eventId as string
    const { data: session, status: authStatus } = useSession()

    const [event, setEvent] = useState<any>(null)
    const [athletes, setAthletes] = useState<any[]>([])
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [votingInProgress, setVotingInProgress] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            const [eventRes, regRes, settingsRes] = await Promise.all([
                fetch(`/api/events/${eventId}`),
                fetch(`/api/events/${eventId}/registrations`),
                fetch(`/api/votes/${eventId}/settings`)
            ])
            const eventData = await eventRes.json()
            const regData = await regRes.json()
            const settingsData = await settingsRes.json()

            setEvent(eventData)
            setAthletes(regData.map((r: any) => r.athlete))
            setSettings(settingsData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [eventId])

    const handleVote = async (athleteId: string) => {
        if (authStatus !== 'authenticated') {
            toast.error('กรุณาเข้าสู่ระบบเพื่อโหวต')
            router.push(`/login?callbackUrl=/vote/${eventId}`)
            return
        }

        setVotingInProgress(athleteId)
        try {
            const res = await fetch(`/api/votes/${eventId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ athleteId })
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'เกิดข้อผิดพลาดในการโหวต')
            } else {
                toast.success('ขอบคุณสำหรับคะแนนโหวต!')
                router.push(`/vote/${eventId}/results`)
            }
        } catch (error) {
            toast.error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
        } finally {
            setVotingInProgress(null)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-48 w-full rounded-3xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80 w-full rounded-3xl" />)}
                </div>
            </div>
        )
    }

    if (!event) return null

    const filteredAthletes = athletes.filter(a =>
        (a.firstName + a.lastName + (a.nickname || '')).toLowerCase().includes(search.toLowerCase())
    )

    const isVotingActive = settings?.votingEnabled &&
        (!settings.votingStart || new Date(settings.votingStart) <= new Date()) &&
        (!settings.votingEnd || new Date(settings.votingEnd) >= new Date())

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/vote">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        กลับไปหน้าโหวต
                    </Link>
                </Button>
                <Button variant="outline" asChild className="glass border-white/10">
                    <Link href={`/vote/${eventId}/results`}>
                        ดูผลโหวตสด
                    </Link>
                </Button>
            </div>

            <PageHeader
                title={`โหวตนักกีฬายอดเยี่ยม: ${event.name}`}
                description="ร่วมเป็นส่วนหนึ่งในการตัดสินรางวัล Popular Vote สำหรับรายการนี้"
            />

            {/* Voting Info Status */}
            {!isVotingActive ? (
                <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-3xl flex items-center gap-4 text-destructive">
                    <Info className="h-6 w-6 shrink-0" />
                    <div>
                        <p className="font-bold">ขณะนี้ยังไม่เปิดให้ลงคะแนน</p>
                        <p className="text-sm">
                            {settings?.votingStart && `เริ่มโหวต: ${format(new Date(settings.votingStart), 'dd MMMM yyyy HH:mm', { locale: th })}`}
                            {settings?.votingEnd && ` | สิ้นสุด: ${format(new Date(settings.votingEnd), 'dd MMMM yyyy HH:mm', { locale: th })}`}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl flex items-center gap-4 text-emerald-500">
                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                    <div>
                        <p className="font-bold">ระบบเปิดรับคะแนนโหวตแล้ว!</p>
                        <p className="text-sm">คุณสามารถลงคะแนนได้ {settings?.maxVotesPerUser || 1} สิทธิ์</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <SearchInput
                        placeholder="ค้นหาชื่อนักกีฬา..."
                        onSearch={setSearch}
                    />
                </div>
            </div>

            {filteredAthletes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredAthletes.map((athlete) => (
                        <div key={athlete.id} className="flex flex-col space-y-4">
                            <AthleteCard
                                firstName={athlete.firstName}
                                lastName={athlete.lastName}
                                nickname={athlete.nickname}
                                studentId={athlete.studentId}
                                hexCode={athlete.color.hexCode}
                                colorName={athlete.color.name}
                                majorName={athlete.major.name}
                                photoUrl={athlete.photoUrl}
                            />
                            <Button
                                className="w-full rounded-xl h-11 font-bold shadow-lg"
                                disabled={!isVotingActive || votingInProgress !== null}
                                onClick={() => handleVote(athlete.id)}
                            >
                                {votingInProgress === athlete.id ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Vote className="mr-2 h-4 w-4" />
                                        โหวตให้นักกีฬาคนนี้
                                    </>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="ไม่พบนักกีฬาในรายการนี้"
                    description="ยังไม่มีนักกีฬาลงทะเบียนเข้าร่วมรายการนี้ หรือไม่พบนักกีฬาที่ค้นหา"
                />
            )}
        </div>
    )
}
