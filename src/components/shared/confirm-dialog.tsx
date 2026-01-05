import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
    variant?: "destructive" | "default" | "primary"
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText = "ยืนยัน",
    cancelText = "ยกเลิก",
    isLoading = false,
    variant = "default"
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-none sm:max-w-[425px]">
                <DialogHeader className="space-y-4">
                    <div className={cn(
                        "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
                        variant === "destructive" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                    )}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-2 text-center">
                        <DialogTitle className="text-xl font-black">{title}</DialogTitle>
                        <DialogDescription className="text-sm">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-6 flex gap-2 sm:flex-row-reverse sm:justify-center">
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-xl px-8 min-w-[120px]"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="rounded-xl px-8"
                    >
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
