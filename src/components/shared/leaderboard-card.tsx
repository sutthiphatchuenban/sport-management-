"use client"

import { Trophy, Star, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardCardProps {
    rank: number
    name: string
    score: number
    hexCode: string
    isMain?: boolean
}

export function LeaderboardCard({
    rank,
    name,
    score,
    hexCode,
    isMain = false
}: LeaderboardCardProps) {
    const isFirst = rank === 1
    const isSecond = rank === 2
    const isThird = rank === 3

    return (
        <div className={cn(
            "relative group flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all duration-500 overflow-hidden",
            isMain ? "w-full sm:w-80 h-96 lg:h-[28rem] z-10" : "w-full sm:w-64 h-80 lg:h-[24rem]",
            isFirst ? "bg-gradient-to-b from-yellow-500/20 via-yellow-500/5 to-background border-2 border-yellow-500/30 shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)]" :
                isSecond ? "bg-gradient-to-b from-zinc-400/20 via-zinc-400/5 to-background border-2 border-zinc-400/30" :
                    isThird ? "bg-gradient-to-b from-amber-600/20 via-amber-600/5 to-background border-2 border-amber-600/30" :
                        "glass border-white/10"
        )}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[100px] pointer-events-none"
                style={{ backgroundColor: `${hexCode}20` }}
            />

            {/* Top Icon / Rank Badge */}
            <div className="relative mb-6">
                <div className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-2xl",
                    isFirst ? "bg-yellow-500" : isSecond ? "bg-zinc-400" : isThird ? "bg-amber-600" : "bg-white/5"
                )}>
                    {isFirst ? <Trophy className="h-10 w-10 text-white" /> :
                        isSecond ? <Medal className="h-10 w-10 text-white" /> :
                            isThird ? <Medal className="h-10 w-10 text-white" /> :
                                <span className="text-2xl font-black text-muted-foreground">#{rank}</span>}
                </div>
            </div>

            {/* Name & Title */}
            <div className="text-center space-y-2 mb-8">
                <h3 className={cn(
                    "font-black tracking-tighter leading-none",
                    isMain ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"
                )}>
                    สี{name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    Leader of the game
                </p>
            </div>

            {/* Score */}
            <div className="relative">
                <div className={cn(
                    "font-black tracking-tighter text-gradient leading-none",
                    isMain ? "text-5xl lg:text-7xl" : "text-4xl lg:text-6xl"
                )}>
                    {score.toLocaleString()}
                </div>
                <div className="absolute -right-8 -bottom-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Pts
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: hexCode }} />
            <div className="absolute top-4 right-4 text-6xl font-black opacity-[0.03] select-none">
                #{rank}
            </div>
            {isFirst && <Star className="absolute top-8 left-8 h-4 w-4 text-yellow-500/40 animate-pulse" />}
            {isFirst && <Star className="absolute bottom-12 right-12 h-3 w-3 text-yellow-500/30 animate-pulse delay-75" />}
        </div>
    )
}
