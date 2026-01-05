import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { th } from "date-fns/locale"

interface MatchScore {
    team1: {
        name: string
        colorHex: string
        score: number
    }
    team2: {
        name: string
        colorHex: string
        score: number
    }
}

interface EventCardProps {
    name: string
    sportType: string
    date: Date
    time: string
    location?: string | null
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
    matchScore?: MatchScore | null
    className?: string
}

export function EventCard({
    name,
    sportType,
    date,
    time,
    location,
    status,
    matchScore,
    className
}: EventCardProps) {
    const statusConfig = {
        UPCOMING: { label: 'เตรียมการ', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
        ONGOING: { label: 'กำลังแข่งขัน', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30 animate-pulse' },
        COMPLETED: { label: 'จบการแข่งขัน', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
        CANCELLED: { label: 'ยกเลิก', color: 'bg-destructive/20 text-destructive border-destructive/30' }
    }

    const currentStatus = statusConfig[status]

    return (
        <Card className={cn(
            "group overflow-hidden border-none glass transition-all hover:scale-[1.02] hover:shadow-lg",
            className
        )}>
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Left: Event Info */}
                    <div className="flex-1 p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] font-bold uppercase tracking-widest px-2">
                                    {sportType}
                                </Badge>
                                <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {name}
                                </h3>
                            </div>
                            <Badge className={cn("px-3 py-1 text-[10px] font-bold uppercase border", currentStatus.color)}>
                                {currentStatus.label}
                            </Badge>
                        </div>

                        {/* Match Score Display */}
                        {matchScore && status === 'COMPLETED' && (
                            <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-6 w-6 rounded-full border-2 border-white/20"
                                        style={{ backgroundColor: matchScore.team1.colorHex }}
                                    />
                                    <span className="font-bold text-sm">{matchScore.team1.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="text-2xl font-black"
                                        style={{ color: matchScore.team1.colorHex }}
                                    >
                                        {matchScore.team1.score}
                                    </span>
                                    <span className="text-lg font-bold text-muted-foreground">-</span>
                                    <span
                                        className="text-2xl font-black"
                                        style={{ color: matchScore.team2.colorHex }}
                                    >
                                        {matchScore.team2.score}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">{matchScore.team2.name}</span>
                                    <div
                                        className="h-6 w-6 rounded-full border-2 border-white/20"
                                        style={{ backgroundColor: matchScore.team2.colorHex }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="rounded-lg bg-white/5 p-2">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <span className="font-medium">
                                    {format(date, 'd MMM yyyy', { locale: th })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="rounded-lg bg-white/5 p-2">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{time} น.</span>
                            </div>
                        </div>

                        {location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-white/5 pt-4">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-medium">{location}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Decorative or Action area */}
                    <div className="hidden md:flex w-24 items-center justify-center bg-white/5 border-l border-white/5 group-hover:bg-primary/5 transition-colors">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background border border-white/10 shadow-sm transition-transform group-hover:rotate-12">
                            <Trophy className="h-6 w-6 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
