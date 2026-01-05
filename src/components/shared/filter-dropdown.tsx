"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FilterDropdownProps {
    label: string
    options: { label: string; value: string }[]
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function FilterDropdown({
    label,
    options,
    value,
    onValueChange,
    placeholder,
    className
}: FilterDropdownProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                {label}
            </label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="h-11 rounded-2xl glass border-white/10 px-4 focus:ring-primary/50 text-sm font-bold">
                    <SelectValue placeholder={placeholder || `เลือก${label}`} />
                </SelectTrigger>
                <SelectContent className="glass border-white/10 rounded-2xl">
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-sm font-medium focus:bg-primary/10 focus:text-primary rounded-xl"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
