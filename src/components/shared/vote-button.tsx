"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoteButtonProps {
    isVoted?: boolean
    isLoading?: boolean
    voteCount?: number
    onClick?: () => void
    size?: "sm" | "md" | "lg"
    className?: string
}

export function VoteButton({
    isVoted = false,
    isLoading = false,
    voteCount,
    onClick,
    size = "md",
    className
}: VoteButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Button
            variant="outline"
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
            className={cn(
                "relative h-auto rounded-2xl overflow-hidden transition-all duration-300 group shadow-lg",
                isVoted
                    ? "bg-pink-500/10 border-pink-500/50 text-pink-500 hover:bg-pink-500/20"
                    : "glass border-white/10 hover:border-pink-500/30",
                size === "sm" ? "px-3 py-1.5" : size === "lg" ? "px-8 py-4" : "px-6 py-3",
                className
            )}
            onClick={onClick}
            disabled={isLoading || isVoted}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Animation */}
            <div className={cn(
                "absolute inset-0 bg-pink-500/10 opacity-0 transition-opacity duration-300 pointer-events-none",
                isHovered && !isVoted && "opacity-100"
            )} />

            <div className="flex items-center gap-2 relative z-10">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <div className="relative">
                        <Heart
                            className={cn(
                                "h-5 w-5 transition-all duration-500",
                                isVoted ? "fill-pink-500 scale-110" : "group-hover:scale-125 group-hover:text-pink-500",
                                isHovered && "animate-bounce"
                            )}
                        />
                        {isHovered && !isVoted && (
                            <div className="absolute inset-0 animate-ping opacity-50">
                                <Heart className="h-5 w-5 text-pink-400 fill-pink-400" />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col items-start leading-none ml-1">
                    <span className="text-sm font-black uppercase tracking-widest">
                        {isVoted ? "โหวตแล้ว" : "โหวตนักกีฬา"}
                    </span>
                    {voteCount !== undefined && (
                        <span className="text-[10px] font-bold opacity-70 mt-0.5">
                            {voteCount.toLocaleString()} โหวต
                        </span>
                    )}
                </div>
            </div>
        </Button>
    )
}
