"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react"
import { syncService, type SyncStatus } from "@/lib/sync/sync-service"

export function SyncStatusComponent() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    last_sync: "Never",
    pending_operations: 0,
    failed_operations: 0,
    is_online: true,
    sync_in_progress: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(syncService.getSyncStatus())
    }

    updateStatus()
    const interval = setInterval(updateStatus, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleForceSync = async () => {
    setIsLoading(true)
    try {
      await syncService.forcSync()
      setSyncStatus(syncService.getSyncStatus())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">État de Synchronisation</CardTitle>
        <div className="flex items-center space-x-2">
          {syncStatus.is_online ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <Badge variant={syncStatus.is_online ? "default" : "destructive"}>
            {syncStatus.is_online ? "En ligne" : "Hors ligne"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Dernière sync</p>
              <p className="font-medium">{syncStatus.last_sync}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Statut</p>
              <div className="flex items-center space-x-1">
                {syncStatus.sync_in_progress ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>En cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Prêt</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {(syncStatus.pending_operations > 0 || syncStatus.failed_operations > 0) && (
            <div className="space-y-2">
              {syncStatus.pending_operations > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Opérations en attente</span>
                  <Badge variant="secondary">{syncStatus.pending_operations}</Badge>
                </div>
              )}
              {syncStatus.failed_operations > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Opérations échouées</span>
                  <Badge variant="destructive">{syncStatus.failed_operations}</Badge>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleForceSync}
            disabled={isLoading || syncStatus.sync_in_progress}
            className="w-full"
            size="sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Synchronisation...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Forcer la Sync
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
