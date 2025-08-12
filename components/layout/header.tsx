"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Administration"
      case "doctor":
        return "Espace Médecin"
      case "nurse":
        return "Espace Infirmier"
      case "pharmacist":
        return "Pharmacie"
      case "receptionist":
        return "Accueil"
      default:
        return "Tableau de bord"
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user ? getRoleTitle(user.role) : "Tableau de bord"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    user?.role === "admin"
                      ? "bg-purple-100 dark:bg-purple-900"
                      : user?.role === "doctor"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : user?.role === "nurse"
                          ? "bg-green-100 dark:bg-green-900"
                          : user?.role === "pharmacist"
                            ? "bg-orange-100 dark:bg-orange-900"
                            : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      user?.role === "admin"
                        ? "text-purple-700 dark:text-purple-200"
                        : user?.role === "doctor"
                          ? "text-blue-700 dark:text-blue-200"
                          : user?.role === "nurse"
                            ? "text-green-700 dark:text-green-200"
                            : user?.role === "pharmacist"
                              ? "text-orange-700 dark:text-orange-200"
                              : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {user?.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
