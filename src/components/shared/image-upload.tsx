"use client"

import { useState, useRef } from "react"
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onRemove: () => void
    label?: string
    className?: string
    disabled?: boolean
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    label = "รูปภาพ",
    className,
    disabled = false
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setPreview(result)
                onChange(result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className={cn("space-y-4 w-full", className)}>
            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                {label}
            </label>

            <div className="relative group">
                {preview ? (
                    <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-3xl border-2 border-white/10 glass shadow-2xl transition-all group-hover:border-primary/50">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="rounded-2xl h-10 w-10 shadow-xl"
                                onClick={() => {
                                    setPreview(null)
                                    onRemove()
                                }}
                                disabled={disabled}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "flex aspect-square w-full max-w-[200px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/10 glass bg-white/5 transition-all hover:border-primary/50 hover:bg-white/[0.08] cursor-pointer group",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !disabled && fileInputRef.current?.click()}
                    >
                        <div className="rounded-2xl bg-primary/10 p-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                            <Camera className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-black text-foreground">อัปโหลดรูปภาพ</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">JPG, PNG (MAX 2MB)</span>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled}
                />
            </div>

            {!preview && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <p className="text-[10px] font-bold text-primary/80 leading-tight uppercase tracking-tight">
                        แนะนำรูปภาพขนาดจัตุรัสเพื่อให้แสดงผลได้สวยงามที่สุด
                    </p>
                </div>
            )}
        </div>
    )
}
