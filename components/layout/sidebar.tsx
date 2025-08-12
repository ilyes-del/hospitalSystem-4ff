"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { PERMISSIONS } from "@/lib/auth/types"
import {
  Calendar,
  Users,
  Package,
  Settings,
  Hospital,
  Activity,
  UserCheck,
  Pill,
  ArrowLeftRight,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  roles?: string[]
}

const navigationItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Activity,
  },
  {
    title: "Rendez-vous",
    href: "/appointments",
    icon: Calendar,
    permission: PERMISSIONS.VIEW_APPOINTMENTS,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
    permission: PERMISSIONS.VIEW_PATIENTS,
  },
  {
    title: "Consultations",
    href: "/consultations",
    icon: UserCheck,
    permission: PERMISSIONS.VIEW_MEDICAL_RECORDS,
    roles: ["doctor", "nurse"],
  },
  {
    title: "Pharmacie",
    href: "/pharmacy",
    icon: Pill,
    permission: PERMISSIONS.VIEW_INVENTORY,
  },
  {
    title: "Stock",
    href: "/inventory",
    icon: Package,
    permission: PERMISSIONS.VIEW_INVENTORY,
  },
  {
    title: "Transferts",
    href: "/referrals",
    icon: ArrowLeftRight,
    permission: PERMISSIONS.VIEW_REFERRALS,
  },
  {
    title: "Rapports",
    href: "/reports",
    icon: BarChart3,
    permission: PERMISSIONS.VIEW_STOCK_REPORTS,
  },
  {
    title: "Administration",
    href: "/admin",
    icon: Shield,
    permission: PERMISSIONS.MANAGE_USERS,
    roles: ["admin"],
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, hasPermission, hasRole } = useAuth()

  const filteredItems = navigationItems.filter((item) => {
    if (item.permission && !hasPermission(item.permission)) {
      return false
    }
    if (item.roles && !hasRole(item.roles)) {
      return false
    }
    return true
  })

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">NHS Algérie</h1>
              <p className="text-xs text-gray-500">{user?.hospital_name}</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">{user.full_name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">
                {user.role} • {user.department}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
