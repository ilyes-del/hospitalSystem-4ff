"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Database, Download, Upload, RefreshCw, HardDrive, AlertTriangle } from "lucide-react"

interface DatabaseInfo {
  name: string
  size: string
  tables: number
  lastBackup: string
  status: "healthy" | "warning" | "error"
}

export function DatabaseManagement() {
  const [databases, setDatabases] = useState<DatabaseInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [backupLoading, setBackupLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDatabaseInfo()
  }, [])

  const fetchDatabaseInfo = async () => {
    try {
      // Simulate database info
      const mockDatabases: DatabaseInfo[] = [
        {
          name: "hospital_main",
          size: "2.4 GB",
          tables: 45,
          lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          status: "healthy",
        },
        {
          name: "hospital_audit",
          size: "856 MB",
          tables: 12,
          lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          status: "warning",
        },
        {
          name: "hospital_archive",
          size: "5.2 GB",
          tables: 23,
          lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          status: "healthy",
        },
      ]
      setDatabases(mockDatabases)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de la base de données.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async (dbName: string) => {
    setBackupLoading(true)
    try {
      // Simulate backup creation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Sauvegarde créée",
        description: `La sauvegarde de ${dbName} a été créée avec succès.`,
      })

      fetchDatabaseInfo()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la sauvegarde.",
        variant: "destructive",
      })
    } finally {
      setBackupLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Database className="h-4 w-4" />
      case "warning":
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des informations de la base de données...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion de la base de données</h2>
        <Button onClick={fetchDatabaseInfo} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taille totale</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5 GB</div>
            <p className="text-xs text-muted-foreground">Toutes les bases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables totales</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
            <p className="text-xs text-muted-foreground">Toutes les bases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière sauvegarde</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6h</div>
            <p className="text-xs text-muted-foreground">Il y a</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bases de données</CardTitle>
          <CardDescription>État et gestion des bases de données du système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {databases.map((db) => (
              <div key={db.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">{db.name}</h3>
                    <p className="text-sm text-gray-500">
                      {db.size} • {db.tables} tables
                    </p>
                    <p className="text-xs text-gray-400">
                      Dernière sauvegarde: {new Date(db.lastBackup).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(db.status)}>
                    {getStatusIcon(db.status)}
                    <span className="ml-1">{db.status}</span>
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => createBackup(db.name)} disabled={backupLoading}>
                    {backupLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions de maintenance</CardTitle>
            <CardDescription>Opérations de maintenance de la base de données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Optimiser les tables
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Database className="mr-2 h-4 w-4" />
              Analyser l'intégrité
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <HardDrive className="mr-2 h-4 w-4" />
              Nettoyer les logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sauvegarde et restauration</CardTitle>
            <CardDescription>Gestion des sauvegardes automatiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Télécharger sauvegarde
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Upload className="mr-2 h-4 w-4" />
              Restaurer depuis fichier
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Programmer sauvegarde
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
