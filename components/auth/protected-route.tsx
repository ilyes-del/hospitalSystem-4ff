"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string | string[]
  requiredPermission?: string
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const { user, isLoading, hasRole, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push("/unauthorized")
        return
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, requiredRole, requiredPermission, hasRole, hasPermission, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null // Will redirect to unauthorized
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null // Will redirect to unauthorized
  }

  return <>{children}</>
}
