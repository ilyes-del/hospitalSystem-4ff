"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, FileText, Stethoscope } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function DoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([])
  const [stats, setStats] = useState({
    todayPatients: 0,
    pendingNotes: 0,
    upcomingShifts: 0,
    completedToday: 0,
  })
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    fetchDoctorData()
  }, [])

  const fetchDoctorData = async () => {
    try {
      const response = await fetch("/api/dashboard/doctor-stats")
      if (response.ok) {
        const data = await response.json()
        setTodayAppointments(data.appointments)
        setStats(data.stats)
        setWeeklyData(data.weeklyData)
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error)
      // Mock data for demo
      setTodayAppointments([
        { id: 1, time: "09:00", patient: "Ahmed Benali", type: "Consultation", status: "confirmed" },
        { id: 2, time: "10:30", patient: "Fatima Khelil", type: "Suivi", status: "waiting" },
        { id: 3, time: "14:00", patient: "Mohamed Saidi", type: "Urgence", status: "in-progress" },
      ])
      setStats({ todayPatients: 12, pendingNotes: 3, upcomingShifts: 2, completedToday: 8 })
      setWeeklyData([
        { day: "Lun", patients: 15 },
        { day: "Mar", patients: 12 },
        { day: "Mer", patients: 18 },
        { day: "Jeu", patients: 14 },
        { day: "Ven", patients: 16 },
        { day: "Sam", patients: 8 },
        { day: "Dim", patients: 5 },
      ])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de Bord Médecin</h1>
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
            <CardTitle className="text-sm font-medium">Patients Aujourd'hui</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayPatients}</div>
            <p className="text-xs text-muted-foreground">{stats.completedToday} terminés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes en Attente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingNotes}</div>
            <p className="text-xs text-muted-foreground">À compléter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaines Gardes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingShifts}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Terminées aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rendez-vous d'Aujourd'hui
            </CardTitle>
            <CardDescription>{todayAppointments.length} rendez-vous programmés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((appointment: any) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{appointment.time}</div>
                    <div>
                      <div className="font-medium">{appointment.patient}</div>
                      <div className="text-sm text-muted-foreground">{appointment.type}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status === "confirmed" && "Confirmé"}
                    {appointment.status === "waiting" && "En attente"}
                    {appointment.status === "in-progress" && "En cours"}
                    {appointment.status === "completed" && "Terminé"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              Voir tous les rendez-vous
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Patient Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Patients par Jour</CardTitle>
            <CardDescription>Activité de la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
