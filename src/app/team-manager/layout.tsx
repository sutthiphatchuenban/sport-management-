import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { TeamSidebar } from '@/components/team/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, ChevronRight } from "lucide-react"
import prisma from '@/lib/prisma'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export default async function TeamManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEAM_MANAGER')) {
        redirect('/login')
    }

    // Fetch color info if Team Manager
    let color: any = null
    if (session.user.colorId) {
        color = await prisma.color.findUnique({
            where: { id: session.user.colorId },
            select: { name: true, hexCode: true }
        })
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <TeamSidebar />

            <main className="lg:pl-72 min-h-screen transition-all duration-300">
                {/* Top Header / Breadcrumb Bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#020617]/60 px-8 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Breadcrumb>
                            <BreadcrumbList className="flex-wrap">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/team-manager" className="text-muted-foreground hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
                                        <Home className="h-3.5 w-3.5" />
                                        <span>Team Console</span>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-3.5 w-3.5 opacity-20" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="font-bold text-slate-200">Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {color && (
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Management for</span>
                                    <span className="text-sm font-black whitespace-nowrap" style={{ color: color.hexCode }}>TEAM {color.name.toUpperCase()}</span>
                                </div>
                                <div className="h-8 w-8 rounded-lg shadow-lg" style={{ backgroundColor: color.hexCode }} />
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
