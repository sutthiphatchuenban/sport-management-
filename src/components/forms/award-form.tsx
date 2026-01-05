"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { awardSchema, type AwardInput } from "@/lib/validations"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Trophy, Award, Star, Image as ImageIcon } from "lucide-react"
import { ImageUpload } from "@/components/shared/image-upload"

interface AwardFormProps {
    initialData?: Partial<AwardInput>
    onSubmit: SubmitHandler<AwardInput>
    isLoading?: boolean
}

export function AwardForm({
    initialData,
    onSubmit,
    isLoading = false
}: AwardFormProps) {
    const form = useForm<AwardInput>({
        resolver: zodResolver(awardSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            awardType: initialData?.awardType || "OVERALL",
            category: initialData?.category || "",
            prizeDetails: initialData?.prizeDetails || "",
            imageUrl: initialData?.imageUrl || "",
        },
    })

    const awardType = form.watch("awardType")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 space-y-4">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <ImageIcon className="h-3 w-3" />
                                        รูปภาพรางวัล
                                    </FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value ?? undefined}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                            label="อัปโหลดรูปรางวัล"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Trophy className="h-3 w-3" />
                                            ชื่อรางวัล
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="เช่น นักกีฬายอดเยี่ยม (MVP), ดาวซัลโว" {...field} className="h-12 rounded-xl glass border-white/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="awardType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Award className="h-3 w-3" />
                                            ประเภทรางวัล
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl glass border-white/10">
                                                    <SelectValue placeholder="เลือกประเภทรางวัล" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="glass border-white/10 rounded-xl">
                                                <SelectItem value="OVERALL">ยอดเยี่ยมรวม (Overall)</SelectItem>
                                                <SelectItem value="CATEGORY">ยอดเยี่ยมประเภทกีฬา (Category)</SelectItem>
                                                <SelectItem value="SPECIAL">รางวัลพิเศษ (Special)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {awardType === "CATEGORY" && (
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <Star className="h-3 w-3" />
                                                ระบุประเภทกีฬา
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="เช่น ฟุตบอล, วอลเลย์บอล" {...field} className="h-12 rounded-xl glass border-white/10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">รายละเอียดเกณฑ์การตัดสิน</FormLabel>
                                    <FormControl>
                                        <Input placeholder="เช่น รวมคะแนนโหวตจากทุกแมชต์..." {...field} className="h-12 rounded-xl glass border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prizeDetails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">ของรางวัล</FormLabel>
                                    <FormControl>
                                        <Input placeholder="เช่น โล่เกียรติยศ และเงินรางวัล 1,000 บาท" {...field} className="h-12 rounded-xl glass border-white/10" />
                                    </FormControl>
                                    <FormDescription className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">
                                        รายละเอียดที่จะแสดงให้ผู้ใช้เห็น
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="rounded-2xl px-12 h-14 text-base shadow-glow">
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {initialData ? "บันทึกการแก้ไข" : "สร้างรางวัล"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
