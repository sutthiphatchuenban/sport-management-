import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Vote } from "lucide-react"
import { cn } from "@/lib/utils"

interface AthleteCardProps {
    firstName: string
    lastName: string
    nickname?: string | null
    studentId: string
    majorName: string
    colorName: string
    hexCode: string
    photoUrl?: string | null
    totalVotes?: number
    totalMedals?: number
    className?: string
}

export function AthleteCard({
    firstName,
    lastName,
    nickname,
    studentId,
    majorName,
    colorName,
    hexCode,
    photoUrl,
    totalVotes = 0,
    totalMedals = 0,
    className
}: AthleteCardProps) {
    return (
        <Card className={cn(
            "group relative overflow-hidden border-none glass transition-all duration-300 hover:scale-[1.03] hover:shadow-xl",
            className
        )}>
            {/* Background highlight */}
            <div
                className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: hexCode }}
            />

            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Athlete Image */}
                    <div className="relative">
                        <Avatar
                            className="h-24 w-24 border-2 border-white/10 shadow-lg transition-all group-hover:ring-2"
                            style={{
                                boxShadow: `0 0 20px ${hexCode}20`,
                                borderColor: `${hexCode}40`
                            }}
                        >
                            <AvatarImage src={photoUrl ?? undefined} className="object-cover" />
                            <AvatarFallback className="bg-muted text-2xl font-black">
                                {firstName[0]}{lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background"
                            style={{ backgroundColor: hexCode }}
                        />
                    </div>

                    {/* Name & ID */}
                    <div className="space-y-1">
                        <h3 className="text-xl font-black tracking-tight text-foreground">
                            {firstName} {lastName}
                            {nickname && (
                                <span className="text-muted-foreground ml-1 font-bold">({nickname})</span>
                            )}
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {studentId}
                        </p>
                    </div>

                    {/* Team Info */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <Badge variant="outline" className="border-white/10 glass px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">
                            {majorName}
                        </Badge>
                        <Badge
                            style={{ backgroundColor: hexCode + '20', color: hexCode, borderColor: hexCode + '40' }}
                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-tighter border"
                        >
                            สี{colorName}
                        </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid w-full grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        <div className="flex flex-col items-center p-2 rounded-xl bg-white/5">
                            <Vote className="h-4 w-4 text-pink-500 mb-1" />
                            <span className="text-xs font-black text-foreground">{totalVotes}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">โหวต</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-xl bg-white/5">
                            <Trophy className="h-4 w-4 text-amber-500 mb-1" />
                            <span className="text-xs font-black text-foreground">{totalMedals}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">เหรียญ</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
