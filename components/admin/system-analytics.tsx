"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Users, Calendar, Package, TrendingUp } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Line, LineChart } from "recharts"

const performanceData = [
  { month: "Jan", patients: 1245, appointments: 890, transfers: 23 },
  { month: "Fév", patients: 1356, appointments: 945, transfers: 31 },
  { month: "Mar", patients: 1489, appointments: 1023, transfers: 28 },
  { month: "Avr", patients: 1523, appointments: 1156, transfers: 35 },
  { month: "Mai", patients: 1634, appointments: 1234, transfers: 42 },
  { month: "Jun", patients: 1712, appointments: 1345, transfers: 38 },
]

const departmentStats = [
  { name: "Urgences", patients: 2456, efficiency: 87 },
  { name: "Cardiologie", patients: 1234, efficiency: 92 },
  { name: "Pédiatrie", patients: 1567, efficiency: 89 },
  { name: "Chirurgie", patients: 987, efficiency: 94 },
  { name: "Radiologie", patients: 1876, efficiency: 85 },
]

export function SystemAnalytics() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des analyses...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analyses du système</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,456</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,345</div>
            <p className="text-xs text-muted-foreground">+8% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">-5% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficacité moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+3% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#8884d8" name="Patients" />
                <Line type="monotone" dataKey="appointments" stroke="#82ca9d" name="RDV" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficacité par département</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#8884d8" name="Efficacité %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques par département</CardTitle>
          <CardDescription>Nombre de patients traités et taux d'efficacité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.name}</h4>
                  <p className="text-sm text-gray-500">{dept.patients} patients traités</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{dept.efficiency}%</div>
                  <div className="text-sm text-gray-500">Efficacité</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
