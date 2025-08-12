"use client"

import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

interface EnhancedToastOptions {
  title: string
  description?: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useEnhancedToast() {
  const { toast } = useToast()

  const showToast = ({ title, description, type, duration = 5000, action }: EnhancedToastOptions) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      info: Info,
      warning: AlertTriangle,
    }

    const variants = {
      success: "default" as const,
      error: "destructive" as const,
      info: "default" as const,
      warning: "default" as const,
    }

    const Icon = icons[type]

    return toast({
      title: (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{title}</span>
        </div>
      ),
      description,
      variant: variants[type],
      duration,
      action: action
        ? {
            altText: action.label,
            children: action.label,
            onClick: action.onClick,
          }
        : undefined,
    })
  }

  return {
    success: (title: string, description?: string, options?: Partial<EnhancedToastOptions>) =>
      showToast({ title, description, type: "success", ...options }),
    error: (title: string, description?: string, options?: Partial<EnhancedToastOptions>) =>
      showToast({ title, description, type: "error", ...options }),
    info: (title: string, description?: string, options?: Partial<EnhancedToastOptions>) =>
      showToast({ title, description, type: "info", ...options }),
    warning: (title: string, description?: string, options?: Partial<EnhancedToastOptions>) =>
      showToast({ title, description, type: "warning", ...options }),
  }
}
