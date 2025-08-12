"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type AuthContextType, type AuthUser, type AuthSession, type LoginCredentials, ROLE_PERMISSIONS } from "./types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const token = localStorage.getItem("hospital_auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      // Validate token with backend
      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const sessionData = await response.json()
        setUser(sessionData.user)
        setSession(sessionData)
      } else {
        // Invalid token, clear storage
        localStorage.removeItem("hospital_auth_token")
      }
    } catch (error) {
      console.error("Session validation error:", error)
      localStorage.removeItem("hospital_auth_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const sessionData = await response.json()

      // Store token
      localStorage.setItem("hospital_auth_token", sessionData.token)

      setUser(sessionData.user)
      setSession(sessionData)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("hospital_auth_token")
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem("hospital_auth_token")
      setUser(null)
      setSession(null)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    return rolePermissions.includes(permission as any)
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  const value: AuthContextType = {
    user,
    session,
    login,
    logout,
    isLoading,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
