import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PodiumPlace {
    name: string
    colorName: string
    hexCode: string
    photoUrl?: string | null
    score?: number
}

interface ResultPodiumProps {
    first: PodiumPlace
    second?: PodiumPlace
    third?: PodiumPlace
    className?: string
}

export function ResultPodium({
    first,
    second,
    third,
    className
}: ResultPodiumProps) {
    return (
        <div className={cn("flex items-end justify-center pt-20 pb-8", className)}>
            {/* Second Place */}
            {second && (
                <div className="flex flex-col items-center group w-24 sm:w-32 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="relative mb-4">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-zinc-400/50 shadow-xl transition-transform group-hover:scale-110">
                            <AvatarImage src={second.photoUrl ?? undefined} />
                            <AvatarFallback className="bg-muted font-bold">{second.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-3 -right-3 rounded-full bg-zinc-400 p-1 shadow-lg">
                            <Medal className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    <div className="h-24 w-full rounded-t-2xl bg-gradient-to-b from-zinc-400/30 to-zinc-400/5 flex flex-col items-center justify-start p-2 border-x border-t border-zinc-400/20">
                        <span className="text-sm font-black text-center line-clamp-1">{second.name}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">สี{second.colorName}</span>
                        <span className="mt-auto text-xl font-black text-zinc-400">2nd</span>
                    </div>
                </div>
            )}

            {/* First Place */}
            <div className="flex flex-col items-center group w-32 sm:w-40 z-10 -mx-2 animate-fade-in-up">
                <div className="relative mb-6">
                    <div className="absolute -inset-4 rounded-full bg-yellow-500/20 blur-2xl animate-pulse" />
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-yellow-500 shadow-yellow-500/20 shadow-2xl transition-transform group-hover:scale-110 relative z-10">
                        <AvatarImage src={first.photoUrl ?? undefined} />
                        <AvatarFallback className="bg-muted text-xl font-bold">{first.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-4 -right-4 rounded-full bg-yellow-500 p-2 shadow-lg z-20">
                        <Trophy className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="h-40 w-full rounded-t-3xl bg-gradient-to-b from-yellow-500/40 via-yellow-500/10 to-transparent flex flex-col items-center justify-start p-4 border-x border-t border-yellow-500/30 shadow-[0_-10px_40px_rgba(234,179,8,0.1)]">
                    <span className="text-base sm:text-lg font-black text-center line-clamp-1">{first.name}</span>
                    <span className="text-xs font-bold text-yellow-500 uppercase">สี{first.colorName}</span>
                    <span className="mt-auto text-3xl font-black text-yellow-500 drop-shadow-sm">1st</span>
                </div>
            </div>

            {/* Third Place */}
            {third && (
                <div className="flex flex-col items-center group w-24 sm:w-32 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="relative mb-4">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-4 border-amber-600/50 shadow-xl transition-transform group-hover:scale-110">
                            <AvatarImage src={third.photoUrl ?? undefined} />
                            <AvatarFallback className="bg-muted font-bold">{third.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 rounded-full bg-amber-600 p-1 shadow-lg">
                            <Medal className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div className="h-16 w-full rounded-t-xl bg-gradient-to-b from-amber-600/30 to-amber-600/5 flex flex-col items-center justify-start p-2 border-x border-t border-amber-600/20">
                        <span className="text-xs font-black text-center line-clamp-1">{third.name}</span>
                        <span className="text-[10px] font-bold text-amber-600 uppercase">สี{third.colorName}</span>
                        <span className="mt-auto text-lg font-black text-amber-600">3rd</span>
                    </div>
                </div>
            )}
        </div>
    )
}
