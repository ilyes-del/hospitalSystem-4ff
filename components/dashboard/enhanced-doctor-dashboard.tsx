"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Users, FileText, Stethoscope, AlertTriangle, Edit } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export function EnhancedDoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([])
  const [urgentCases, setUrgentCases] = useState([])
  const [stats, setStats] = useState({
    todayPatients: 0,
    pendingNotes: 0,
    upcomingShifts: 0,
    completedToday: 0,
  })
  const [weeklyData, setWeeklyData] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [noteDialog, setNoteDialog] = useState(false)
  const [currentNote, setCurrentNote] = useState("")

  useEffect(() => {
    fetchDoctorData()
  }, [])

  const fetchDoctorData = async () => {
    try {
      const response = await fetch("/api/dashboard/doctor-stats")
      if (response.ok) {
        const data = await response.json()
        setTodayAppointments(data.appointments)
        setUrgentCases(data.urgentCases)
        setStats(data.stats)
        setWeeklyData(data.weeklyData)
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error)
      setTodayAppointments([
        {
          id: 1,
          time: "09:00",
          patient: "Ahmed Benali",
          nin: "1234567890123",
          type: "Consultation",
          status: "confirmed",
          duration: 30,
          room: "Salle 101",
        },
        {
          id: 2,
          time: "10:30",
          patient: "Fatima Khelil",
          nin: "2345678901234",
          type: "Suivi",
          status: "waiting",
          duration: 20,
          room: "Salle 102",
        },
        {
          id: 3,
          time: "14:00",
          patient: "Mohamed Saidi",
          nin: "3456789012345",
          type: "Urgence",
          status: "in-progress",
          duration: 45,
          room: "Urgences",
        },
      ])
      setUrgentCases([
        { id: 1, patient: "Aicha Mansouri", condition: "Douleur thoracique", priority: "high", time: "08:45" },
        { id: 2, patient: "Omar Belkacem", condition: "Fièvre élevée", priority: "medium", time: "09:15" },
      ])
      setStats({ todayPatients: 12, pendingNotes: 3, upcomingShifts: 2, completedToday: 8 })
      setWeeklyData([
        { day: "Lun", patients: 15, consultations: 12 },
        { day: "Mar", patients: 12, consultations: 10 },
        { day: "Mer", patients: 18, consultations: 15 },
        { day: "Jeu", patients: 14, consultations: 11 },
        { day: "Ven", patients: 16, consultations: 13 },
        { day: "Sam", patients: 8, consultations: 6 },
        { day: "Dim", patients: 5, consultations: 4 },
      ])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "in-progress":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const handleCompleteAppointment = (appointmentId: number) => {
    setTodayAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "completed" } : apt)),
    )
  }

  const handleAddNote = (appointmentId: number) => {
    setSelectedAppointment(appointmentId)
    setNoteDialog(true)
  }

  const saveNote = () => {
    // Save note logic here
    console.log(`Note for appointment ${selectedAppointment}: ${currentNote}`)
    setNoteDialog(false)
    setCurrentNote("")
    setSelectedAppointment(null)
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Aujourd'hui</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayPatients}</div>
            <p className="text-xs text-muted-foreground">{stats.completedToday} terminés</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes en Attente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingNotes}</div>
            <p className="text-xs text-muted-foreground">À compléter</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaines Gardes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.upcomingShifts}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Terminées aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {urgentCases.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Cas Urgents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {urgentCases.map((case_: any) => (
                <div key={case_.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <div>
                    <div className="font-medium">{case_.patient}</div>
                    <div className="text-sm text-muted-foreground">{case_.condition}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(case_.priority)}>
                      {case_.priority === "high" ? "Urgent" : case_.priority === "medium" ? "Modéré" : "Faible"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{case_.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Planning d'Aujourd'hui
            </CardTitle>
            <CardDescription>{todayAppointments.length} rendez-vous programmés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-blue-600">{appointment.time}</div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status === "confirmed" && "Confirmé"}
                          {appointment.status === "waiting" && "En attente"}
                          {appointment.status === "in-progress" && "En cours"}
                          {appointment.status === "completed" && "Terminé"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleAddNote(appointment.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Note
                        </Button>
                        {appointment.status !== "completed" && (
                          <Button size="sm" onClick={() => handleCompleteAppointment(appointment.id)}>
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{appointment.patient}</div>
                        <div className="text-muted-foreground">NIN: {appointment.nin}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Type: {appointment.type}</div>
                        <div className="text-muted-foreground">Salle: {appointment.room}</div>
                        <div className="text-muted-foreground">Durée: {appointment.duration}min</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patients" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="consultations">Consultations</TabsTrigger>
              </TabsList>
              <TabsContent value="patients">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="consultations">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={noteDialog} onOpenChange={setNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Saisissez vos observations..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNoteDialog(false)}>
                Annuler
              </Button>
              <Button onClick={saveNote}>Sauvegarder</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
