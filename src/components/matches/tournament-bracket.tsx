import { Match, MatchStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { th } from "date-fns/locale"

interface BracketRound {
    roundNumber: number
    roundName: string
    matches: (Match & {
        homeColor: { hexCode: string; name: string }
        awayColor: { hexCode: string; name: string }
        winner?: { id: string } | null
    })[]
}

interface TournamentBracketProps {
    rounds: BracketRound[]
}

export function TournamentBracket({ rounds }: TournamentBracketProps) {
    if (!rounds || rounds.length === 0) return null

    return (
        <ScrollArea className="w-full pb-4">
            <div className="flex gap-16 min-w-max px-4">
                {rounds.map((round) => (
                    <div key={round.roundNumber} className="flex flex-col gap-8 min-w-[300px]">
                        <div className="text-center font-bold text-muted-foreground uppercase tracking-widest text-sm sticky top-0 bg-background/50 backdrop-blur-sm py-2 z-10">
                            {round.roundName}
                        </div>

                        <div className="flex flex-col justify-around flex-grow gap-8">
                            {round.matches.map((match) => (
                                <div key={match.id} className="relative">
                                    <BracketMatchNode match={match} />

                                    {/* Connector Lines Logic (Simplified for now) */}
                                    {/* Ideally we'd draw lines based on nextMatchId */}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

function BracketMatchNode({ match }: { match: any }) {
    const isCompleted = match.status === 'COMPLETED'

    return (
        <div className={`
            rounded-xl overflow-hidden border transition-all duration-300
            ${match.status === 'ONGOING'
                ? 'border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] bg-gradient-to-br from-red-950/30 to-background'
                : 'border-white/10 glass bg-white/5'
            }
        `}>
            {/* Header */}
            <div className="px-3 py-2 bg-black/20 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                <span>Match {match.matchNumber}</span>
                <span>{format(new Date(match.scheduledAt), 'dd MMM HH:mm', { locale: th })}</span>
            </div>

            {/* Teams */}
            <div className="p-3 space-y-2">
                {/* Home Team */}
                <div className={`flex justify-between items-center ${isCompleted && match.winner?.id === match.homeColorId ? 'text-white font-bold' : 'text-muted-foreground'
                    }`}>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: match.homeColor.hexCode, borderColor: match.homeColor.hexCode }}
                        />
                        <span className="text-sm">สี{match.homeColor.name}</span>
                    </div>
                    <span className="font-mono text-lg">{match.homeScore ?? '-'}</span>
                </div>

                {/* Away Team */}
                <div className={`flex justify-between items-center ${isCompleted && match.winner?.id === match.awayColorId ? 'text-white font-bold' : 'text-muted-foreground'
                    }`}>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: match.awayColor.hexCode, borderColor: match.awayColor.hexCode }}
                        />
                        <span className="text-sm">สี{match.awayColor.name}</span>
                    </div>
                    <span className="font-mono text-lg">{match.awayScore ?? '-'}</span>
                </div>
            </div>
        </div>
    )
}
