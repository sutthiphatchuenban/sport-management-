'use client'

import { OrganizerSidebar } from '@/components/organizer/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const paths = pathname.split('/').filter(Boolean)

    return (
        <div className="dark flex min-h-screen bg-[#020617] text-slate-50 selection:bg-emerald-500/30">
            {/* Background Aesthetic */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-none" />

            <OrganizerSidebar />

            <main className="flex-1 lg:pl-72 transition-all duration-300 relative z-10">
                <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6">
                    {/* Top Bar with Breadcrumbs */}
                    <div className="flex items-center justify-between h-8">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/organizer" className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">ORGANIZER</BreadcrumbLink>
                                </BreadcrumbItem>
                                {paths.slice(1).map((path, idx) => (
                                    <div key={path} className="flex items-center">
                                        <BreadcrumbSeparator className="opacity-20" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">{path}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </div>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
