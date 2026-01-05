'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Breadcrumb {
    label: string
    href?: string
}

interface PageHeaderProps {
    title: string
    description?: string
    breadcrumbs?: Breadcrumb[]
    actions?: React.ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('mb-6', className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {index > 0 && <ChevronRight className="h-4 w-4" />}
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-blue-600 hover:underline">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-800 dark:text-white">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            {/* Title & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
                    )}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
        </div>
    )
}
