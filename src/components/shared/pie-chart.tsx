"use client"

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PieChartProps {
    data: { name: string; value: number; color: string }[]
    title?: string
}

export function PieChart({ data, title = "สัดส่วนสถิติ" }: PieChartProps) {
    return (
        <Card className="glass border-none shadow-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="text-xl font-black tracking-tight">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full items-center justify-center min-h-0 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
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
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                                    {value}
                                </span>
                            )}
                        />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
