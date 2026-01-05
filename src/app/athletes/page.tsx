'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { AthleteCard } from '@/components/shared/athlete-card'
import { SearchInput } from '@/components/shared/search-input'
import { FilterDropdown } from '@/components/shared/filter-dropdown'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function AthletesListPage() {
    const [athletes, setAthletes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [majorId, setMajorId] = useState('ALL')
    const [colorId, setColorId] = useState('ALL')
    const [majors, setMajors] = useState<any[]>([])
    const [colors, setColors] = useState<any[]>([])

    const fetchAthletes = async () => {
        try {
            const params = new URLSearchParams({
                search: search,
            })
            if (majorId !== 'ALL') params.append('majorId', majorId)
            if (colorId !== 'ALL') params.append('colorId', colorId)

            const res = await fetch(`/api/athletes?${params.toString()}`)
            const data = await res.json()
            setAthletes(data.athletes || [])
        } catch (error) {
            console.error('Failed to fetch athletes:', error)
        }
    }

    const fetchMetadata = async () => {
        try {
            const [majorRes, colorRes] = await Promise.all([
                fetch('/api/majors'),
                fetch('/api/colors')
            ])
            const majorsData = await majorRes.json()
            const colorsData = await colorRes.json()
            setMajors(majorsData)
            setColors(colorsData)
        } catch (error) {
            console.error('Failed to fetch metadata:', error)
        }
    }

    useEffect(() => {
        fetchMetadata()
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchAthletes().then(() => setLoading(false))
    }, [search, majorId, colorId])

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
            <PageHeader
                title="ทำเนียบนักกีฬา"
                description="รายชื่อนักกีฬาตัวแทนจากแต่ละสีและแต่ละสาขาวิชา"
            />

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <SearchInput
                        placeholder="ค้นหาชื่อ, นามสกุล, ชื่อเล่น หรือรหัสนิสิต..."
                        onSearch={setSearch}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full lg:w-96">
                    <FilterDropdown
                        label="สาขาวิชา"
                        options={[
                            { label: 'ทุกสาขา', value: 'ALL' },
                            ...majors.map(m => ({ label: m.code, value: m.id }))
                        ]}
                        value={majorId}
                        onValueChange={setMajorId}
                    />
                    <FilterDropdown
                        label="สีทีม"
                        options={[
                            { label: 'ทุกสี', value: 'ALL' },
                            ...colors.map(c => ({ label: c.name, value: c.id }))
                        ]}
                        value={colorId}
                        onValueChange={setColorId}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-80 w-full rounded-3xl" />)}
                </div>
            ) : athletes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {athletes.map((athlete) => (
                        <Link key={athlete.id} href={`/athletes/${athlete.id}`}>
                            <AthleteCard
                                firstName={athlete.firstName}
                                lastName={athlete.lastName}
                                nickname={athlete.nickname}
                                studentId={athlete.studentId}
                                hexCode={athlete.color.hexCode}
                                colorName={athlete.color.name}
                                majorName={athlete.major.name}
                                photoUrl={athlete.photoUrl}
                                totalVotes={athlete._count?.votes || 0}
                                totalMedals={athlete.individualResult?.length || 0}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="ไม่พบนักกีฬา"
                    description="ไม่มีข้อมูลนักกีฬาตามเงื่อนไขที่ระบุ"
                />
            )}
        </div>
    )
}
