"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, AlertTriangle, TrendingDown, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function PharmacistDashboard() {
  const [lowStockItems, setLowStockItems] = useState([])
  const [expiringItems, setExpiringItems] = useState([])
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    expiringSoon: 0,
    dispensedToday: 0,
  })
  const [dispensingData, setDispensingData] = useState([])

  useEffect(() => {
    fetchPharmacyData()
  }, [])

  const fetchPharmacyData = async () => {
    try {
      const response = await fetch("/api/dashboard/pharmacy-stats")
      if (response.ok) {
        const data = await response.json()
        setLowStockItems(data.lowStock)
        setExpiringItems(data.expiring)
        setStats(data.stats)
        setDispensingData(data.dispensing)
      }
    } catch (error) {
      console.error("Error fetching pharmacy data:", error)
      // Mock data
      setLowStockItems([
        { id: 1, name: "Paracétamol 500mg", current: 25, minimum: 100, unit: "boîtes" },
        { id: 2, name: "Amoxicilline 250mg", current: 8, minimum: 50, unit: "flacons" },
        { id: 3, name: "Insuline Rapide", current: 3, minimum: 20, unit: "stylos" },
      ])
      setExpiringItems([
        { id: 1, name: "Aspirine 100mg", batch: "LOT2024A", expiry: "2024-02-15", quantity: 50 },
        { id: 2, name: "Vitamine D", batch: "LOT2024B", expiry: "2024-02-28", quantity: 30 },
      ])
      setStats({ totalItems: 1250, lowStock: 15, expiringSoon: 8, dispensedToday: 45 })
      setDispensingData([
        { hour: "08h", count: 5 },
        { hour: "09h", count: 8 },
        { hour: "10h", count: 12 },
        { hour: "11h", count: 15 },
        { hour: "12h", count: 10 },
        { hour: "13h", count: 6 },
        { hour: "14h", count: 9 },
      ])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de Bord Pharmacie</h1>
        <div className="text-sm text-muted-foreground">Stock mis à jour: {new Date().toLocaleString("fr-FR")}</div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">En stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expire Bientôt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">&lt; 30 jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensé Aujourd'hui</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dispensedToday}</div>
            <p className="text-xs text-muted-foreground">Ordonnances</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stock Faible
            </CardTitle>
            <CardDescription>Articles nécessitant un réapprovisionnement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Stock: {item.current} {item.unit} (Min: {item.minimum})
                    </div>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Urgent
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              Générer Commande
            </Button>
          </CardContent>
        </Card>

        {/* Expiring Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              Expiration Proche
            </CardTitle>
            <CardDescription>Articles expirant dans les 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Lot: {item.batch} • Qté: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">{item.expiry}</div>
                    <div className="text-xs text-muted-foreground">Expiration</div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              Voir Tous
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dispensing Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Dispensation par Heure</CardTitle>
          <CardDescription>Activité de dispensation aujourd'hui</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dispensingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
