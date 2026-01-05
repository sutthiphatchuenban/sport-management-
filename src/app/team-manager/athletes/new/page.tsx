'use client'

import { PageHeader } from '@/components/shared/page-header'
import { AthleteForm } from '@/components/team/athlete-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function NewAthletePage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/team-manager/athletes">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <PageHeader
                    title="ลงทะเบียนนักกีฬาใหม่"
                    description="ระบุข้อมูลนิสิตเพื่อเข้าร่วมการแข่งขันในสังกัดสีของคุณ"
                />
            </div>

            <AthleteForm fixedColorId={session?.user?.colorId} />
        </div>
    )
}
