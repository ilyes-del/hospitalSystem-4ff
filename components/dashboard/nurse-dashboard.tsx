"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, Clock, AlertTriangle, Thermometer } from "lucide-react"

export function NurseDashboard() {
  const [patientQueue, setPatientQueue] = useState([])
  const [stats, setStats] = useState({
    waitingPatients: 0,
    triageCompleted: 0,
    vitalsNeeded: 0,
    emergencies: 0,
  })

  useEffect(() => {
    fetchNurseData()
  }, [])

  const fetchNurseData = async () => {
    try {
      const response = await fetch("/api/dashboard/nurse-stats")
      if (response.ok) {
        const data = await response.json()
        setPatientQueue(data.queue)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching nurse data:", error)
      // Mock data
      setPatientQueue([
        { id: 1, name: "Amina Bouali", priority: "high", reason: "Douleur thoracique", waitTime: "15 min" },
        { id: 2, name: "Karim Meziane", priority: "medium", reason: "Fièvre", waitTime: "25 min" },
        { id: 3, name: "Leila Hamdi", priority: "low", reason: "Contrôle", waitTime: "45 min" },
      ])
      setStats({ waitingPatients: 8, triageCompleted: 12, vitalsNeeded: 5, emergencies: 2 })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de Bord Infirmier</h1>
        <div className="text-sm text-muted-foreground">
          Service: Urgences • {new Date().toLocaleTimeString("fr-FR")}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients en Attente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingPatients}</div>
            <p className="text-xs text-muted-foreground">File d'attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Triage Terminé</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.triageCompleted}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signes Vitaux</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vitalsNeeded}</div>
            <p className="text-xs text-muted-foreground">À prendre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgences</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.emergencies}</div>
            <p className="text-xs text-muted-foreground">Priorité haute</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            File d'Attente Patients
          </CardTitle>
          <CardDescription>Patients en attente de triage et de soins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientQueue.map((patient: any) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={getPriorityColor(patient.priority)}>
                    {patient.priority === "high" && "Urgent"}
                    {patient.priority === "medium" && "Modéré"}
                    {patient.priority === "low" && "Faible"}
                  </Badge>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">{patient.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{patient.waitTime}</div>
                  <div className="text-xs text-muted-foreground">d'attente</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1">Appeler Suivant</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Voir Tous
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
