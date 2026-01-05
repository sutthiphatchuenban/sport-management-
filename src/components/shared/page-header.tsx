import { cn } from "@/lib/utils"
import { Breadcrumb } from "@/components/shared/breadcrumb"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    breadcrumb?: { label: string; href?: string }[]
    actions?: React.ReactNode
}

export function PageHeader({
    title,
    description,
    breadcrumb,
    actions,
    className,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 pb-8", className)} {...props}>
            <div className="flex flex-col gap-2">
                {breadcrumb && <Breadcrumb items={breadcrumb} />}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter text-gradient sm:text-4xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-base text-muted-foreground max-w-[600px]">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-3">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        </div>
    )
}
