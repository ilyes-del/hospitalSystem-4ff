"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { Download, BarChart3, Users, Calendar } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Pie, PieChart, Cell } from "recharts"

const ageGroupData = [
  { name: "0-18", value: 245, color: "#8884d8" },
  { name: "19-35", value: 432, color: "#82ca9d" },
  { name: "36-50", value: 387, color: "#ffc658" },
  { name: "51-65", value: 298, color: "#ff7c7c" },
  { name: "65+", value: 156, color: "#8dd1e1" },
]

const genderData = [
  { name: "Hommes", value: 847, color: "#8884d8" },
  { name: "Femmes", value: 671, color: "#82ca9d" },
]

const monthlyRegistrations = [
  { month: "Jan", count: 45 },
  { month: "Fév", count: 52 },
  { month: "Mar", count: 48 },
  { month: "Avr", count: 61 },
  { month: "Mai", count: 55 },
  { month: "Jun", count: 67 },
]

export function PatientReports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [department, setDepartment] = useState("all")
  const [reportType, setReportType] = useState("demographics")
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

      const response = await fetch(`/api/reports/patients?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-patients-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Rapport généré",
          description: "Le rapport des patients a été téléchargé avec succès.",
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
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,518</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux Patients</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Âge Moyen</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.3</div>
            <p className="text-xs text-muted-foreground">ans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Retour</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">Patients récurrents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par âge</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageGroupData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ageGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par genre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
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
          <CardTitle>Nouvelles inscriptions par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport personnalisé</CardTitle>
          <CardDescription>Configurez et téléchargez un rapport détaillé des patients</CardDescription>
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
                  <SelectItem value="demographics">Démographique</SelectItem>
                  <SelectItem value="medical">Médical</SelectItem>
                  <SelectItem value="visits">Visites</SelectItem>
                  <SelectItem value="complete">Complet</SelectItem>
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
