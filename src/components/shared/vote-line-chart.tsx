"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VoteLineChartProps {
    data: { time: string; votes: number }[]
    title?: string
    color?: string
}

export function VoteLineChart({
    data,
    title = "สถิติการโหวตแบบเรียลไทม์",
    color = "#F472B6" // Pink 400
}: VoteLineChartProps) {
    return (
        <Card className="glass border-none shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-black tracking-tight">{title}</CardTitle>
                <div className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4 min-h-0 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: 'none',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                fontWeight: 800,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: color }}
                        />
                        <Area
                            type="monotone"
                            dataKey="votes"
                            stroke={color}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorVotes)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
