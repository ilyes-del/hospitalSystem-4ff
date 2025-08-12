"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Server, Database, Wifi, AlertTriangle, CheckCircle } from "lucide-react"

interface SystemStatus {
  server: {
    status: "healthy" | "warning" | "critical"
    uptime: string
    cpu: number
    memory: number
    disk: number
  }
  database: {
    status: "healthy" | "warning" | "critical"
    connections: number
    maxConnections: number
    responseTime: number
  }
  network: {
    status: "healthy" | "warning" | "critical"
    latency: number
    bandwidth: number
  }
  services: Array<{
    name: string
    status: "running" | "stopped" | "error"
    lastCheck: string
  }>
}

export function SystemMonitoring() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("/api/admin/system-status")
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le statut du système.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
      case "error":
        return "bg-red-100 text-red-800"
      case "stopped":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
      case "critical":
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement du statut système...</div>
  }

  if (!systemStatus) {
    return <div className="text-center p-8">Impossible de charger le statut du système</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Surveillance du système</h2>
        <Button onClick={fetchSystemStatus} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Server Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serveur</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Statut</span>
                <Badge className={getStatusColor(systemStatus.server.status)}>
                  {getStatusIcon(systemStatus.server.status)}
                  <span className="ml-1">{systemStatus.server.status}</span>
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU</span>
                  <span>{systemStatus.server.cpu}%</span>
                </div>
                <Progress value={systemStatus.server.cpu} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mémoire</span>
                  <span>{systemStatus.server.memory}%</span>
                </div>
                <Progress value={systemStatus.server.memory} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disque</span>
                  <span>{systemStatus.server.disk}%</span>
                </div>
                <Progress value={systemStatus.server.disk} className="h-2" />
              </div>
              <div className="text-xs text-gray-500">Uptime: {systemStatus.server.uptime}</div>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de données</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Statut</span>
                <Badge className={getStatusColor(systemStatus.database.status)}>
                  {getStatusIcon(systemStatus.database.status)}
                  <span className="ml-1">{systemStatus.database.status}</span>
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Connexions</span>
                  <span>
                    {systemStatus.database.connections}/{systemStatus.database.maxConnections}
                  </span>
                </div>
                <Progress
                  value={(systemStatus.database.connections / systemStatus.database.maxConnections) * 100}
                  className="h-2"
                />
              </div>
              <div className="text-xs text-gray-500">Temps de réponse: {systemStatus.database.responseTime}ms</div>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réseau</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Statut</span>
                <Badge className={getStatusColor(systemStatus.network.status)}>
                  {getStatusIcon(systemStatus.network.status)}
                  <span className="ml-1">{systemStatus.network.status}</span>
                </Badge>
              </div>
              <div className="text-xs text-gray-500">Latence: {systemStatus.network.latency}ms</div>
              <div className="text-xs text-gray-500">Bande passante: {systemStatus.network.bandwidth}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Services système</CardTitle>
          <CardDescription>État des services critiques du système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-500">Dernière vérification: {service.lastCheck}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
