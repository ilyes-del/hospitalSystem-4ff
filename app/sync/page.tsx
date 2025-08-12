"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { SyncStatusComponent } from "@/components/sync/sync-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FileText } from "lucide-react"

export default function SyncPage() {
  return (
    <ProtectedRoute requiredPermissions={["view_sync"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Synchronisation Nationale</h1>
          <p className="text-muted-foreground">Gestion de la synchronisation avec la base de données nationale</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SyncStatusComponent />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Synchronisés</span>
                  <Badge variant="default">1,234</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>En attente</span>
                  <Badge variant="secondary">5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendez-vous</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Synchronisés</span>
                  <Badge variant="default">856</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>En attente</span>
                  <Badge variant="secondary">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visites</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Synchronisées</span>
                  <Badge variant="default">2,103</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>En attente</span>
                  <Badge variant="secondary">8</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historique de Synchronisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Synchronisation des patients</p>
                  <p className="text-sm text-muted-foreground">5 patients mis à jour</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">Réussie</Badge>
                  <p className="text-sm text-muted-foreground">Il y a 2 min</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Synchronisation des rendez-vous</p>
                  <p className="text-sm text-muted-foreground">12 rendez-vous synchronisés</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">Réussie</Badge>
                  <p className="text-sm text-muted-foreground">Il y a 5 min</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Synchronisation des visites</p>
                  <p className="text-sm text-muted-foreground">3 visites en conflit</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">Conflit</Badge>
                  <p className="text-sm text-muted-foreground">Il y a 10 min</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
