"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { voteSettingsSchema, type VoteSettingsInput } from "@/lib/validations"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Calendar as CalendarIcon, CheckCircle2, Eye, EyeOff } from "lucide-react"

interface VoteSettingsFormProps {
    initialData?: Partial<VoteSettingsInput>
    onSubmit: SubmitHandler<VoteSettingsInput>
    isLoading?: boolean
}

export function VoteSettingsForm({
    initialData,
    onSubmit,
    isLoading = false
}: VoteSettingsFormProps) {
    const form = useForm<VoteSettingsInput>({
        resolver: zodResolver(voteSettingsSchema),
        defaultValues: {
            votingEnabled: initialData?.votingEnabled ?? false,
            votingStart: initialData?.votingStart || "",
            votingEnd: initialData?.votingEnd || "",
            maxVotesPerUser: initialData?.maxVotesPerUser || 1,
            showRealtimeResults: initialData?.showRealtimeResults ?? true,
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="rounded-3xl border border-white/10 glass p-6 space-y-6">
                    <FormField
                        control={form.control}
                        name="votingEnabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-black tracking-tight flex items-center gap-2">
                                        <CheckCircle2 className={field.value ? "text-green-500" : "text-muted-foreground"} />
                                        เปิดระบบโหวตปัจจุบัน
                                    </FormLabel>
                                    <FormDescription className="text-xs font-bold uppercase tracking-widest opacity-60">
                                        หากปิดอยู่ ผู้ใช้งานจะไม่สามารถโหวตได้
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="showRealtimeResults"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-black tracking-tight flex items-center gap-2">
                                        {field.value ? <Eye className="text-blue-500" /> : <EyeOff className="text-muted-foreground" />}
                                        แสดงผลคะแนนโหวต Real-time
                                    </FormLabel>
                                    <FormDescription className="text-xs font-bold uppercase tracking-widest opacity-60">
                                        แสดงผลคะแนนให้นิสิตเห็นแบบเรียลไทม์ขณะเปิดโหวต
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-blue-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="votingStart"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-primary">วันเริ่มโหวต</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input type="datetime-local" {...field} value={field.value || ""} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="votingEnd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-destructive">วันสิ้นสุดโหวต</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input type="datetime-local" {...field} value={field.value || ""} className="h-12 rounded-xl glass border-white/10 pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="maxVotesPerUser"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-auto">จำนวนโหวตสูงสุดต่อคน (คะแนน)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                                        className="h-12 rounded-xl glass border-white/10"
                                    />
                                </FormControl>
                                <FormDescription className="text-[10px] font-bold uppercase tracking-tighter opacity-50">
                                    นิสิตหนึ่งคนสามารถโหวตให้นักกีฬาได้กี่คน/เหรียญ
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-2xl px-12 h-14 text-base shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        บันทึกการตั้งค่า
                    </Button>
                </div>
            </form>
        </Form>
    )
}
