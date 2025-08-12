"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-lg font-semibold" role="heading" aria-level={3}>
          {title}
        </h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-sm">{description}</p>
        {action && (
          <Button onClick={action.onClick} aria-label={action.label}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
