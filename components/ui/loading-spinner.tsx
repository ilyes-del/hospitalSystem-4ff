"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)} role="status" aria-live="polite">
      <Loader2 className={cn("animate-spin", sizeClasses[size])} aria-hidden="true" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  )
}
