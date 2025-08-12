import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Accès Refusé</CardTitle>
          <CardDescription>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Contactez votre administrateur système pour obtenir les autorisations appropriées.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Retour au tableau de bord</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/login">Se reconnecter</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
