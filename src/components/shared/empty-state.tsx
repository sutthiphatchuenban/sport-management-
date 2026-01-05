import { LucideIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    title: string
    description?: string
    icon?: LucideIcon
    action?: {
        label: string
        onClick?: () => void
        href?: string
    }
    className?: string
}

export function EmptyState({
    title,
    description,
    icon: Icon = Search,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/5 py-16 px-4 text-center glass",
            className
        )}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 shadow-inner mb-6">
                <Icon className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
                {title}
            </h3>
            {description && (
                <p className="mt-2 text-sm text-muted-foreground max-w-[300px]">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-8">
                    {action.href ? (
                        <Button asChild className="rounded-xl px-8 shadow-glow">
                            <a href={action.href}>{action.label}</a>
                        </Button>
                    ) : (
                        <Button onClick={action.onClick} className="rounded-xl px-8 shadow-glow">
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
