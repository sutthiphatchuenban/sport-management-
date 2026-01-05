import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    text?: string
    fullPage?: boolean
}

export function LoadingSpinner({
    size = 'md',
    className,
    text,
    fullPage = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    }

    const content = (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="relative">
                <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
                <div className={cn(
                    "absolute inset-0 blur-xl bg-primary/20 opacity-50 animate-pulse",
                    sizeClasses[size]
                )} />
            </div>
            {text && (
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    )

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {content}
            </div>
        )
    }

    return content
}
