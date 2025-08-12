"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, UserPlus } from "lucide-react"

export function ReceptionistDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([])
  const [waitingPatients, setWaitingPatients] = useState([])
  const [stats, setStats] = useState({
    totalAppointments: 0,
    checkedIn: 0,
    waiting: 0,
    newRegistrations: 0,
  })

  useEffect(() => {
    fetchReceptionData()
  }, [])

  const fetchReceptionData = async () => {
    try {
      const response = await fetch("/api/dashboard/reception-stats")
      if (response.ok) {
        const data = await response.json()
        setTodayAppointments(data.appointments)
        setWaitingPatients(data.waiting)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching reception data:", error)
      // Mock data
      setTodayAppointments([
        { id: 1, time: "09:00", patient: "Ahmed Benali", doctor: "Dr. Amara", status: "checked-in" },
        { id: 2, time: "09:30", patient: "Fatima Khelil", doctor: "Dr. Bouali", status: "waiting" },
        { id: 3, time: "10:00", patient: "Mohamed Saidi", doctor: "Dr. Amara", status: "scheduled" },
      ])
      setWaitingPatients([
        { id: 1, name: "Amina Meziane", doctor: "Dr. Bouali", waitTime: "15 min", priority: "normal" },
        { id: 2, name: "Karim Hamdi", doctor: "Dr. Amara", waitTime: "25 min", priority: "urgent" },
      ])
      setStats({ totalAppointments: 45, checkedIn: 28, waiting: 8, newRegistrations: 5 })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de Bord Accueil</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Programmés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enregistrés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">Patients arrivés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waiting}</div>
            <p className="text-xs text-muted-foreground">File d'attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux Patients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newRegistrations}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rendez-vous du Jour
            </CardTitle>
            <CardDescription>Gestion des arrivées et enregistrements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((appointment: any) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{appointment.time}</div>
                    <div>
                      <div className="font-medium">{appointment.patient}</div>
                      <div className="text-sm text-muted-foreground">{appointment.doctor}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status === "checked-in" && "Enregistré"}
                    {appointment.status === "waiting" && "En attente"}
                    {appointment.status === "scheduled" && "Programmé"}
                    {appointment.status === "completed" && "Terminé"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1">Nouveau RDV</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Voir Tous
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Waiting Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Patients en Attente
            </CardTitle>
            <CardDescription>File d'attente actuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waitingPatients.map((patient: any) => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">{patient.doctor}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{patient.waitTime}</div>
                    <Badge variant={patient.priority === "urgent" ? "destructive" : "secondary"}>
                      {patient.priority === "urgent" ? "Urgent" : "Normal"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1">Appeler Suivant</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Gérer File
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
