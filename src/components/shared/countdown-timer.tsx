"use client"

import { useState, useEffect } from "react"
import { Timer, Hourglass } from "lucide-react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
    targetDate: Date
    label?: string
    onEnd?: () => void
    className?: string
}

export function CountdownTimer({
    targetDate,
    label = "สิ้นสุดใน",
    onEnd,
    className
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                onEnd?.()
            }
        }

        const timer = setInterval(calculateTimeLeft, 1000)
        calculateTimeLeft()

        return () => clearInterval(timer)
    }, [targetDate, onEnd])

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl glass border-white/10 bg-white/5 text-xl font-black tracking-tighter text-gradient">
                {value.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {label}
            </span>
        </div>
    )

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Hourglass className="h-3 w-3 animate-pulse" />
                {label}
            </div>
            <div className="flex gap-2">
                <TimeBlock value={timeLeft.days} label="Days" />
                <span className="mt-2 text-xl font-black text-muted-foreground opacity-50">:</span>
                <TimeBlock value={timeLeft.hours} label="Hrs" />
                <span className="mt-2 text-xl font-black text-muted-foreground opacity-50">:</span>
                <TimeBlock value={timeLeft.minutes} label="Min" />
                <span className="mt-2 text-xl font-black text-muted-foreground opacity-50">:</span>
                <TimeBlock value={timeLeft.seconds} label="Sec" />
            </div>
        </div>
    )
}
