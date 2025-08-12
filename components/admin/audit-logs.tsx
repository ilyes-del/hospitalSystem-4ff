"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Download, Filter } from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  ip_address: string
  user_agent: string
  severity: "info" | "warning" | "error"
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch("/api/admin/audit-logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les journaux d'audit.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportLogs = async () => {
    try {
      const response = await fetch("/api/admin/audit-logs/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export réussi",
          description: "Les journaux d'audit ont été exportés avec succès.",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les journaux d'audit.",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    const matchesAction = actionFilter === "all" || log.action.includes(actionFilter)

    return matchesSearch && matchesSeverity && matchesAction
  })

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des journaux d'audit...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Journaux d'audit</h2>
        <Button onClick={exportLogs} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sévérité</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Avertissement</SelectItem>
                  <SelectItem value="error">Erreur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="LOGIN">Connexion</SelectItem>
                  <SelectItem value="CREATE">Création</SelectItem>
                  <SelectItem value="UPDATE">Modification</SelectItem>
                  <SelectItem value="DELETE">Suppression</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={fetchAuditLogs}>
                <Filter className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Journaux d'activité</CardTitle>
          <CardDescription>
            {filteredLogs.length} entrée(s) trouvée(s) sur {logs.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(log.severity)}>{log.severity.toUpperCase()}</Badge>
                    <span className="font-medium">{log.action}</span>
                    <span className="text-gray-500">sur</span>
                    <span className="font-medium">{log.resource}</span>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString("fr-FR")}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Utilisateur:</strong> {log.user}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Détails:</strong> {log.details}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>IP: {log.ip_address}</span>
                  <span>Agent: {log.user_agent.substring(0, 50)}...</span>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun journal d'audit trouvé avec les filtres actuels.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
