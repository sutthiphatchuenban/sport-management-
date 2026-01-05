"use client"

import { useMemo } from "react"
import { Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardChartProps {
    data: { id: string; name: string; score: number; hexCode: string }[]
    className?: string
}

export function LeaderboardChart({ data, className }: LeaderboardChartProps) {
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.score - a.score)
    }, [data])

    const maxScore = useMemo(() => {
        return Math.max(...data.map(d => d.score), 1)
    }, [data])

    return (
        <div className={cn("space-y-6 w-full", className)}>
            {sortedData.map((item, index) => {
                const percentage = (item.score / maxScore) * 100
                const isFirst = index === 0

                return (
                    <div key={item.id} className="relative group">
                        {/* Track Info */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg font-black text-sm transition-transform group-hover:scale-110",
                                    isFirst ? "bg-yellow-500 text-white shadow-glow shadow-yellow-500/50" : "bg-white/5 text-muted-foreground"
                                )}>
                                    {index + 1}
                                </div>
                                <span className={cn(
                                    "font-black tracking-tight",
                                    isFirst ? "text-xl text-foreground" : "text-lg text-muted-foreground"
                                )}>
                                    สี{item.name}
                                    {isFirst && <Star className="inline-block h-4 w-4 ml-2 fill-yellow-500 text-yellow-500 animate-pulse" />}
                                </span>
                            </div>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-black tracking-tighter text-gradient leading-none">
                                    {item.score.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mb-0.5">
                                    Pts
                                </span>
                            </div>
                        </div>

                        {/* Animated Bar Track */}
                        <div className="relative h-6 w-full rounded-2xl bg-white/5 overflow-hidden border border-white/5">
                            <div
                                className="absolute inset-y-0 left-0 rounded-2xl transition-all duration-1000 ease-out flex items-center justify-end px-4 group-hover:brightness-125 shadow-xl"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: item.hexCode,
                                    boxShadow: `0 0 30px ${item.hexCode}30`
                                }}
                            >
                                <div className="h-1 w-8 rounded-full bg-white/40 blur-[1px] animate-pulse" />
                            </div>

                            {/* Shine Effect */}
                            <div
                                className="absolute inset-y-0 left-0 w-32 bg-white/10 blur-xl animate-shimmer pointer-events-none"
                                style={{ transform: 'skewX(-20deg)' }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
