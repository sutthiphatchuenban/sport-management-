"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreBarChartProps {
    data: { name: string; score: number; hexCode: string }[]
    title?: string
}

export function ScoreBarChart({ data, title = "คะแนนรวมแต่ละสี" }: ScoreBarChartProps) {
    return (
        <Card className="glass border-none shadow-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="text-xl font-black tracking-tight">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full pt-4 min-h-0 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: 'none',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                fontWeight: 800,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar
                            dataKey="score"
                            radius={[8, 8, 0, 0]}
                            label={{
                                position: 'top',
                                fill: 'rgba(255,255,255,0.7)',
                                fontSize: 12,
                                fontWeight: 900,
                                offset: 10
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.hexCode} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
