"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { Download, Users, Clock, TrendingUp, Activity } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Pie, PieChart, Cell } from "recharts"

const staffPerformance = [
  { name: "Dr. Benali", patients: 145, efficiency: 92 },
  { name: "Dr. Khelil", patients: 132, efficiency: 88 },
  { name: "Dr. Saidi", patients: 128, efficiency: 95 },
  { name: "Dr. Cherif", patients: 119, efficiency: 87 },
  { name: "Dr. Boudali", patients: 115, efficiency: 90 },
]

const departmentWorkload = [
  { name: "Urgences", workload: 85, color: "#ff6b6b" },
  { name: "Cardiologie", workload: 72, color: "#4ecdc4" },
  { name: "Pédiatrie", workload: 68, color: "#45b7d1" },
  { name: "Chirurgie", workload: 91, color: "#f9ca24" },
  { name: "Radiologie", workload: 76, color: "#6c5ce7" },
]

const waitingTimes = [
  { department: "Urgences", average: 25, target: 15 },
  { department: "Cardiologie", average: 18, target: 20 },
  { department: "Pédiatrie", average: 12, target: 15 },
  { department: "Chirurgie", average: 35, target: 30 },
  { department: "Radiologie", average: 22, target: 25 },
]

export function OperationalReports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [department, setDepartment] = useState("all")
  const [reportType, setReportType] = useState("performance")
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

      const response = await fetch(`/api/reports/operational?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-operationnel-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Rapport généré",
          description: "Le rapport opérationnel a été téléchargé avec succès.",
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
            <CardTitle className="text-sm font-medium">Personnel actif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Médecins et infirmiers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps d'attente moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Capacité utilisée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficacité globale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance du personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#8884d8" name="Patients traités" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charge de travail par département</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentWorkload}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="workload"
                  label={({ name, workload }) => `${name}: ${workload}%`}
                >
                  {departmentWorkload.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temps d'attente par département</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {waitingTimes.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.department}</h4>
                  <p className="text-sm text-gray-500">Objectif: {dept.target} min</p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${dept.average > dept.target ? "text-red-600" : "text-green-600"}`}
                  >
                    {dept.average} min
                  </div>
                  <div className="text-sm text-gray-500">
                    {dept.average > dept.target ? "Au-dessus" : "Dans l'objectif"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport personnalisé</CardTitle>
          <CardDescription>Configurez et téléchargez un rapport opérationnel détaillé</CardDescription>
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
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="workload">Charge de travail</SelectItem>
                  <SelectItem value="efficiency">Efficacité</SelectItem>
                  <SelectItem value="waiting_times">Temps d'attente</SelectItem>
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
