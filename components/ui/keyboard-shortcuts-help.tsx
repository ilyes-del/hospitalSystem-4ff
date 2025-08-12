"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Keyboard, Command } from "lucide-react"

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  description: string
}

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[]
}

export function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsHelpProps) {
  const [open, setOpen] = useState(false)

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys = []
    if (shortcut.ctrlKey) keys.push("Ctrl")
    if (shortcut.altKey) keys.push("Alt")
    if (shortcut.shiftKey) keys.push("Shift")
    keys.push(shortcut.key.toUpperCase())
    return keys.join(" + ")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50"
          aria-label="Afficher les raccourcis clavier"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Raccourcis Clavier
          </DialogTitle>
          <DialogDescription>Utilisez ces raccourcis pour naviguer plus rapidement</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground flex-1">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {formatShortcut(shortcut)}
              </Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
