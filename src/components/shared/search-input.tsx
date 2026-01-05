"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchInputProps {
    placeholder?: string
    onSearch: (value: string) => void
    defaultValue?: string
    className?: string
    delay?: number
}

export function SearchInput({
    placeholder = "ค้นหา...",
    onSearch,
    defaultValue = "",
    className,
    delay = 500
}: SearchInputProps) {
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value)
        }, delay)

        return () => clearTimeout(timer)
    }, [value, delay, onSearch])

    return (
        <div className={cn("relative group", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="h-11 rounded-2xl glass border-white/10 pl-10 pr-10 focus:ring-primary/50 transition-all"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl text-muted-foreground hover:bg-white/5"
                    onClick={() => setValue("")}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
