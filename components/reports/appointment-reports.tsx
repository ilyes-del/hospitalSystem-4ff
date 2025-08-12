"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { Download, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Line, LineChart } from "recharts"

const appointmentStatusData = [
  { name: "Confirmés", value: 342, color: "#22c55e" },
  { name: "En attente", value: 89, color: "#f59e0b" },
  { name: "Annulés", value: 23, color: "#ef4444" },
  { name: "Terminés", value: 456, color: "#3b82f6" },
]

const weeklyAppointments = [
  { day: "Lun", count: 45, completed: 42 },
  { day: "Mar", count: 52, completed: 48 },
  { day: "Mer", count: 48, completed: 45 },
  { day: "Jeu", count: 61, completed: 58 },
  { day: "Ven", count: 55, completed: 52 },
  { day: "Sam", count: 32, completed: 30 },
  { day: "Dim", count: 18, completed: 16 },
]

const hourlyDistribution = [
  { hour: "08h", count: 12 },
  { hour: "09h", count: 18 },
  { hour: "10h", count: 25 },
  { hour: "11h", count: 22 },
  { hour: "12h", count: 8 },
  { hour: "13h", count: 5 },
  { hour: "14h", count: 20 },
  { hour: "15h", count: 28 },
  { hour: "16h", count: 24 },
  { hour: "17h", count: 15 },
]

export function AppointmentReports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [department, setDepartment] = useState("all")
  const [reportType, setReportType] = useState("summary")
  const { toast } = useToast()

  const generateReport = async () => {
    try {
      const params = new URLSearchParams({
        type: reportType,
        department,
        ...(dateRange && {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        }),
      })

      const response = await fetch(`/api/reports/appointments?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-rdv-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Rapport généré",
          description: "Le rapport des rendez-vous a été téléchargé avec succès.",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RDV</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">910</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">50.1% du total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annulés</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">2.5% du total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps d'attente moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par jour de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Programmés" />
                <Bar dataKey="completed" fill="#82ca9d" name="Terminés" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution par heure</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {appointmentStatusData.map((status) => (
              <div key={status.name} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold" style={{ color: status.color }}>
                  {status.value}
                </div>
                <div className="text-sm text-gray-600">{status.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport personnalisé</CardTitle>
          <CardDescription>Configurez et téléchargez un rapport détaillé des rendez-vous</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type de rapport</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Résumé</SelectItem>
                  <SelectItem value="detailed">Détaillé</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="cancellations">Annulations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="urgences">Urgences</SelectItem>
                  <SelectItem value="cardiologie">Cardiologie</SelectItem>
                  <SelectItem value="pediatrie">Pédiatrie</SelectItem>
                  <SelectItem value="chirurgie">Chirurgie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              Générer le rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
