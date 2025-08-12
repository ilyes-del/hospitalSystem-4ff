"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth/auth-context"
import { Loader2, Hospital, Info } from "lucide-react"

export function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    hospitalCode: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(credentials)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const fillDemoAccount = (username: string, password: string) => {
    setCredentials({
      username,
      password,
      hospitalCode: "HCA001",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex gap-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Hospital className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Système Hospitalier National</CardTitle>
            <CardDescription>Connectez-vous à votre compte hospitalier</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hospitalCode">Code Hôpital</Label>
                <Input
                  id="hospitalCode"
                  type="text"
                  placeholder="ex: HCA001"
                  value={credentials.hospitalCode}
                  onChange={handleChange("hospitalCode")}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Votre nom d'utilisateur"
                  value={credentials.username}
                  onChange={handleChange("username")}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={credentials.password}
                  onChange={handleChange("password")}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Comptes de Démonstration</CardTitle>
            </div>
            <CardDescription>Cliquez sur un rôle pour remplir automatiquement les identifiants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start h-auto p-3 bg-transparent"
                onClick={() => fillDemoAccount("admin", "admin123")}
                disabled={isSubmitting}
              >
                <div className="text-left">
                  <div className="font-medium">Administrateur</div>
                  <div className="text-sm text-muted-foreground">admin / admin123</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-3 bg-transparent"
                onClick={() => fillDemoAccount("docteur", "doc123")}
                disabled={isSubmitting}
              >
                <div className="text-left">
                  <div className="font-medium">Docteur</div>
                  <div className="text-sm text-muted-foreground">docteur / doc123</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-3 bg-transparent"
                onClick={() => fillDemoAccount("infirmier", "nurse123")}
                disabled={isSubmitting}
              >
                <div className="text-left">
                  <div className="font-medium">Infirmier(ère)</div>
                  <div className="text-sm text-muted-foreground">infirmier / nurse123</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-3 bg-transparent"
                onClick={() => fillDemoAccount("pharmacien", "pharm123")}
                disabled={isSubmitting}
              >
                <div className="text-left">
                  <div className="font-medium">Pharmacien</div>
                  <div className="text-sm text-muted-foreground">pharmacien / pharm123</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-3 bg-transparent"
                onClick={() => fillDemoAccount("receptionniste", "recep123")}
                disabled={isSubmitting}
              >
                <div className="text-left">
                  <div className="font-medium">Réceptionniste</div>
                  <div className="text-sm text-muted-foreground">receptionniste / recep123</div>
                </div>
              </Button>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Code hôpital: <span className="font-mono">HCA001</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
