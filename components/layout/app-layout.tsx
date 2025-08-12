"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  // Pages that should not have the sidebar
  const noSidebarPages = ["/login", "/unauthorized", "/"]

  const shouldShowSidebar = !noSidebarPages.includes(pathname)

  if (!shouldShowSidebar) {
    return <>{children}</>
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
