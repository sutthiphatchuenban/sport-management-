import {
    Breadcrumb as BreadcrumbRoot,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
    items: {
        label: string
        href?: string
    }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <BreadcrumbRoot>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/" className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <div key={item.label} className="flex items-center gap-2">
                            <BreadcrumbItem>
                                {isLast || !item.href ? (
                                    <BreadcrumbPage className="font-bold text-foreground">
                                        {item.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href}>{item.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && (
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>
                            )}
                        </div>
                    )
                })}
            </BreadcrumbList>
        </BreadcrumbRoot>
    )
}
