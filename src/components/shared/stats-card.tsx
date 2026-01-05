import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    description?: string
    color?: string
    trend?: {
        value: number
        isUp: boolean
    }
    className?: string
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    description,
    color = "text-primary",
    trend,
    className
}: StatsCardProps) {
    return (
        <Card className={cn("glass border-none shadow-md transition-all hover:scale-[1.02]", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {label}
                        </p>
                        <h3 className="text-3xl font-black tracking-tighter sm:text-4xl text-foreground">
                            {value}
                        </h3>
                    </div>
                    <div className={cn("rounded-2xl bg-background/50 p-3 shadow-inner", color)}>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                </div>

                {(description || trend) && (
                    <div className="mt-4 flex items-center gap-2">
                        {trend && (
                            <span className={cn(
                                "flex items-center text-xs font-bold",
                                trend.isUp ? "text-emerald-500" : "text-destructive"
                            )}>
                                {trend.isUp ? "+" : "-"}
                                {trend.value}%
                            </span>
                        )}
                        {description && (
                            <p className="text-xs font-medium text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
