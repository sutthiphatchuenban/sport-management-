'use client'

import { useEffect, useState, useRef } from 'react'
import {
    Trophy,
    Medal,
    Clock,
    Zap,
    Award,
    Star,
    TrendingUp,
    MapPin,
    Flame,
    Users
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function TVDisplayPage() {
    const [data, setData] = useState<any>(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [loading, setLoading] = useState(true)

    // Auto-refresh data every 15 seconds
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/public/tv-stats')
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error('Failed to fetch TV stats:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const dataInterval = setInterval(fetchData, 15000)
        const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000)

        return () => {
            clearInterval(dataInterval)
            clearInterval(clockInterval)
        }
    }, [])

    if (loading || !data) {
        return (
            <div className="fixed inset-0 bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="h-20 w-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    <h1 className="text-2xl font-black tracking-widest text-emerald-500 animate-pulse uppercase">Initializing Stadium Display...</h1>
                </div>
            </div>
        )
    }

    const { standings, ongoingEvents, upcomingEvents, recentResults, topVoted } = data

    return (
        <div className="fixed inset-0 bg-[#020617] overflow-hidden text-slate-50 font-noto cursor-none select-none">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 h-full flex flex-col p-8 gap-6 overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center h-20">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <Flame className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter leading-none">IT SPORT 2024</h1>
                            <p className="text-base font-bold text-emerald-400 tracking-[0.3em] uppercase mt-1">Stadium Live Feed</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-8 py-3 rounded-2xl backdrop-blur-xl">
                        <div className="text-right">
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest leading-none mb-1">Current Time</p>
                            <p className="text-3xl font-black font-mono leading-none">{format(currentTime, 'HH:mm:ss')}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-left">
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest leading-none mb-1">{format(currentTime, 'EEEE', { locale: th })}</p>
                            <p className="text-xl font-black leading-none">{format(currentTime, 'd MMMM yyyy', { locale: th })}</p>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">

                    {/* Left Panel: Overall Standings */}
                    <div className="col-span-8 flex flex-col min-h-0">
                        <div className="flex-1 glass border-none rounded-[40px] p-8 flex flex-col gap-4 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
                            <div className="flex items-center justify-between flex-shrink-0">
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    <Trophy className="h-7 w-7 text-amber-500" />
                                    ตารางคะแนนรวม (Overall Standings)
                                </h2>
                                <Badge className="bg-emerald-500 text-white text-sm px-5 py-1.5 rounded-lg font-black uppercase tracking-widest animate-pulse border-none">
                                    LIVE UPDATE
                                </Badge>
                            </div>

                            <div className="flex-1 flex flex-col justify-between overflow-hidden py-2">
                                {standings.slice(0, 4).map((team: any, i: number) => (
                                    <div key={team.id} className="group">
                                        <div className="flex items-center gap-6 p-2 rounded-3xl transition-all hover:bg-white/5">
                                            <div className={`
                                                h-14 w-14 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shrink-0
                                                ${i === 0 ? 'bg-amber-500 text-white' :
                                                    i === 1 ? 'bg-slate-300 text-slate-800' :
                                                        i === 2 ? 'bg-amber-800 text-white' :
                                                            'bg-white/10 text-slate-400'}
                                            `}>
                                                {i + 1}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-3xl font-black truncate">สี{team.name}</h3>
                                                    <div className="text-4xl font-black text-emerald-400 font-mono tracking-tighter shrink-0">
                                                        {team.totalScore.toLocaleString()}
                                                        <span className="text-sm font-bold opacity-30 ml-2">PTS</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 mt-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                                                        <span className="text-base font-bold">{team.gold} <small className="opacity-40 text-[8px] font-black uppercase">GOLD</small></span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-slate-200" />
                                                        <span className="text-base font-bold">{team.silver} <small className="opacity-40 text-[8px] font-black uppercase">SILVER</small></span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-amber-900" />
                                                        <span className="text-base font-bold">{team.bronze} <small className="opacity-40 text-[8px] font-black uppercase">BRONZE</small></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {i < 3 && <div className="h-px bg-white/5" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="col-span-4 flex flex-col gap-6 min-h-0">
                        {/* Live Match */}
                        <div className="bg-indigo-600 rounded-[40px] p-6 flex flex-col gap-4 shadow-2xl border border-white/20 shrink-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    < Zap className="h-4 w-4 fill-white" />
                                    Live Match
                                </h3>
                                <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                            </div>
                            {ongoingEvents.length > 0 ? (
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-black leading-tight italic uppercase tracking-tighter line-clamp-1">
                                        {ongoingEvents[0].name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-white/20 text-white border-none rounded-md font-bold text-[10px]">{ongoingEvents[0].sportType.name}</Badge>
                                        <span className="text-[10px] text-white/50 font-bold uppercase flex items-center gap-1">
                                            <MapPin className="h-2.5 w-2.5" />
                                            {ongoingEvents[0].location || 'สนามกลาง'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm font-bold italic opacity-60">เตรียมพร้อมการแข่งขันถัดไป...</p>
                            )}
                        </div>

                        {/* Popular Vote */}
                        <div className="flex-1 glass border-none rounded-[40px] p-8 flex flex-col gap-4 min-h-0 overflow-hidden">
                            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 flex-shrink-0">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                Popular Vote
                            </h3>
                            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                                {topVoted.map((athlete: any, i: number) => (
                                    <div key={athlete.id} className="flex items-center gap-4 py-1">
                                        <div className="text-sm font-black opacity-20 w-6">#{i + 1}</div>
                                        <div className="h-8 w-1 flex-shrink-0 rounded-full" style={{ backgroundColor: athlete.color.hexCode }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-black truncate leading-none mb-1">{athlete.name}</p>
                                            <p className="text-[8px] font-black uppercase opacity-40 tracking-wider">สี{athlete.color.name}</p>
                                        </div>
                                        <div className="text-xl font-black text-rose-500 font-mono tracking-tighter">{athlete.votes}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Ticker */}
                <div className="flex-shrink-0 h-16 bg-[#0a0f1e] border border-white/5 rounded-2xl flex items-center overflow-hidden relative shadow-2xl">
                    <div className="bg-emerald-500 h-full px-10 flex items-center text-white font-black text-lg uppercase tracking-widest italic flex-shrink-0 z-30 shadow-2xl">
                        Results
                    </div>

                    <div className="flex-1 h-full relative overflow-hidden">
                        {/* Gradient overlays for smooth fading */}
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0f1e] via-[#0a0f1e]/80 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0f1e] via-[#0a0f1e]/80 to-transparent z-20 pointer-events-none" />

                        {/* The ticker itself - centering vertically with h-full and items-center */}
                        <div className="flex animate-ticker whitespace-nowrap gap-20 items-center h-full">
                            {/* Horizontal spacer to prevent immediate overlap */}
                            <div className="w-40 flex-shrink-0" />

                            {recentResults && recentResults.length > 0 ? (
                                <>
                                    {recentResults.map((res: any, i: number) => (
                                        <div key={`ticker-${i}`} className="flex items-center gap-6">
                                            <span className="text-white/30 font-bold font-mono text-sm uppercase tracking-tighter">{res.event.name}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-3 w-3 rounded-full shadow-glow-sm" style={{ backgroundColor: res.color.hexCode }} />
                                                <span className="text-white text-lg font-black italic">สี{res.color.name}</span>
                                            </div>
                                            <div className="bg-white/10 text-white text-xs px-3 py-1 rounded-lg font-black">RANK {res.rank}</div>
                                            <span className="text-white/10 text-4xl font-thin mx-4">/</span>
                                        </div>
                                    ))}
                                    {/* Duplicate for infinite loop */}
                                    {recentResults.map((res: any, i: number) => (
                                        <div key={`ticker-dup-${i}`} className="flex items-center gap-6">
                                            <span className="text-white/30 font-bold font-mono text-sm uppercase tracking-tighter">{res.event.name}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-3 w-3 rounded-full shadow-glow-sm" style={{ backgroundColor: res.color.hexCode }} />
                                                <span className="text-white text-lg font-black italic">สี{res.color.name}</span>
                                            </div>
                                            <div className="bg-white/10 text-white text-xs px-3 py-1 rounded-lg font-black">RANK {res.rank}</div>
                                            <span className="text-white/10 text-4xl font-thin mx-4">/</span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <span className="text-white/40 font-bold italic tracking-widest text-lg px-20">NO RECENT RESULTS YET... STAY TUNED!</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 45s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.15; transform: scale(1.1); }
                }
                .shadow-glow-sm {
                    box-shadow: 0 0 10px currentColor;
                }
            `}</style>
        </div>
    )
}
