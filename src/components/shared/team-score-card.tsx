import { Star, Medal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TeamScoreCardProps {
    name: string
    score: number
    hexCode: string
    rank: number
    className?: string
}

export function TeamScoreCard({
    name,
    score,
    hexCode,
    rank,
    className
}: TeamScoreCardProps) {
    const isFirst = rank === 1
    const isSecond = rank === 2
    const isThird = rank === 3

    return (
        <Card className={cn(
            "relative overflow-hidden border-none transition-all duration-300 hover:scale-[1.03] group",
            isFirst ? "ring-2 ring-yellow-500/50 shadow-yellow-500/10" : "glass",
            className
        )}>
            {/* Top color bar */}
            <div
                className="absolute top-0 left-0 h-1.5 w-full transition-all group-hover:h-2"
                style={{ backgroundColor: hexCode }}
            />

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">สี{name}</CardTitle>
                <div className="flex items-center gap-1">
                    {isFirst && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500 animate-pulse-slow" />}
                    {isSecond && <Medal className="h-5 w-5 text-zinc-400" />}
                    {isThird && <Medal className="h-5 w-5 text-amber-600" />}
                    <span className="text-2xl font-black opacity-10">#{rank}</span>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black tracking-tighter text-gradient">
                        {score.toLocaleString()}
                    </span>
                    <span className="pb-1 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Pts
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                        style={{ backgroundColor: hexCode, boxShadow: `0 0 10px ${hexCode}40` }}
                    />
                    <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${Math.min(100, (score / 2000) * 100)}%`, // Sample max score 2000
                                backgroundColor: hexCode
                            }}
                        />
                    </div>
                </div>
            </CardContent>

            {/* Background glow for rank 1 */}
            {isFirst && (
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-yellow-500/10 blur-3xl" />
            )}
        </Card>
    )
}
