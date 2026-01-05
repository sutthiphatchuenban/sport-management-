import { cn } from "@/lib/utils"

interface VoteProgressProps {
    value: number
    total: number
    label: string
    color?: string
    className?: string
}

export function VoteProgress({
    value,
    total,
    label,
    color = "bg-primary",
    className
}: VoteProgressProps) {
    const percentage = total > 0 ? (value / total) * 100 : 0

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{value.toLocaleString()} โหวต ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 shadow-inner">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
