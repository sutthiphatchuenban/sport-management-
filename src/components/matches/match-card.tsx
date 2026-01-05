import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Trophy } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import Link from "next/link"
import { Match, MatchStatus } from "@/types"

interface MatchCardProps {
    match: Partial<Match> & {
        homeColor: { hexCode: string; name: string }
        awayColor: { hexCode: string; name: string }
    }
}

export function MatchCard({ match }: MatchCardProps) {
    const isCompleted = match.status === 'COMPLETED'
    const isLive = match.status === 'ONGOING'

    return (
        <Card className={`overflow-hidden border-none transition-all duration-300 hover:scale-[1.02] ${isLive
            ? 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/20 ring-1 ring-red-500/20'
            : 'glass hover:bg-white/10'
            }`}>
            <CardContent className="p-0">
                {/* Header (Time/Status) */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(match.scheduledAt!), 'HH:mm', { locale: th })} น.
                        <span className="opacity-30">|</span>
                        <span>{match.roundName}</span>
                    </div>
                    {isLive && (
                        <Badge variant="destructive" className="animate-pulse shadow-glow font-bold">
                            LIVE
                        </Badge>
                    )}
                    {isCompleted && (
                        <Badge variant="secondary" className="bg-white/10 text-muted-foreground font-medium">
                            จบการแข่งขัน
                        </Badge>
                    )}
                </div>

                {/* Scoreboard */}
                <div className="p-5 flex items-center justify-between gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                        <div
                            className="h-12 w-12 rounded-full border-4 shadow-lg flex items-center justify-center text-xs font-black relative"
                            style={{
                                borderColor: match.homeColor?.hexCode,
                                backgroundColor: match.homeColor?.hexCode + '20',
                                color: match.homeColor?.hexCode
                            }}
                        >
                            {/* Initials could go here */}
                        </div>
                        <span className="font-bold text-sm text-center line-clamp-1">
                            สี{match.homeColor?.name}
                        </span>
                    </div>

                    {/* Scores */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <span className={`text-4xl font-black tabular-nums tracking-tighter ${isCompleted || isLive ? 'text-white' : 'text-white/20'
                            }`}>
                            {match.homeScore ?? '-'}
                        </span>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-muted-foreground uppercase opacity-50">VS</span>
                        </div>
                        <span className={`text-4xl font-black tabular-nums tracking-tighter ${isCompleted || isLive ? 'text-white' : 'text-white/20'
                            }`}>
                            {match.awayScore ?? '-'}
                        </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                        <div
                            className="h-12 w-12 rounded-full border-4 shadow-lg flex items-center justify-center text-xs font-black relative"
                            style={{
                                borderColor: match.awayColor?.hexCode,
                                backgroundColor: match.awayColor?.hexCode + '20',
                                color: match.awayColor?.hexCode
                            }}
                        >
                            {/* Initials could go here */}
                        </div>
                        <span className="font-bold text-sm text-center line-clamp-1">
                            สี{match.awayColor?.name}
                        </span>
                    </div>
                </div>

                {/* Footer (Action) */}
                <Link href={`/matches/${match.id}`} className="block">
                    <div className="px-4 py-3 bg-white/5 hover:bg-white/10 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors">
                        ดูรายละเอียด
                        {isCompleted && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}
