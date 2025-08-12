"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { Download, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const stockMovements = [
  { month: "Jan", entrees: 1200, sorties: 980 },
  { month: "Fév", entrees: 1100, sorties: 1050 },
  { month: "Mar", entrees: 1350, sorties: 1200 },
  { month: "Avr", entrees: 1250, sorties: 1180 },
  { month: "Mai", entrees: 1400, sorties: 1320 },
  { month: "Jun", entrees: 1300, sorties: 1250 },
]

const topConsumption = [
  { item: "Paracétamol 500mg", quantity: 2500, unit: "comprimés" },
  { item: "Seringues 5ml", quantity: 1800, unit: "unités" },
  { item: "Gants latex", quantity: 5000, unit: "paires" },
  { item: "Masques chirurgicaux", quantity: 3200, unit: "unités" },
  { item: "Compresses stériles", quantity: 1200, unit: "paquets" },
]

const lowStockItems = [
  { item: "Insuline", current: 5, minimum: 20, status: "critique" },
  { item: "Antibiotiques", current: 12, minimum: 30, status: "faible" },
  { item: "Vaccins", current: 8, minimum: 25, status: "critique" },
  { item: "Matériel de suture", current: 15, minimum: 40, status: "faible" },
]

export function StockReports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [category, setCategory] = useState("all")
  const [reportType, setReportType] = useState("movements")
  const { toast } = useToast()

  const generateReport = async () => {
    try {
      const params = new URLSearchParams({
        type: reportType,
        category,
        ...(dateRange && {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        }),
      })

      const response = await fetch(`/api/reports/stock?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-stock-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Rapport généré",
          description: "Le rapport de stock a été téléchargé avec succès.",
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

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critique":
        return "text-red-600"
      case "faible":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles en stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Articles différents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground">DZD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Articles à réapprovisionner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotation moyenne</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">jours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mouvements de stock</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockMovements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entrees" fill="#22c55e" name="Entrées" />
                <Bar dataKey="sorties" fill="#ef4444" name="Sorties" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Articles les plus consommés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topConsumption.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.quantity.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes de stock</CardTitle>
          <CardDescription>Articles nécessitant un réapprovisionnement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${getStockStatusColor(item.status)}`} />
                  <div>
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-gray-500">Stock minimum: {item.minimum}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getStockStatusColor(item.status)}`}>{item.current} restant(s)</p>
                  <p className="text-sm text-gray-500 capitalize">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport personnalisé</CardTitle>
          <CardDescription>Configurez et téléchargez un rapport détaillé du stock</CardDescription>
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
                  <SelectItem value="movements">Mouvements</SelectItem>
                  <SelectItem value="inventory">Inventaire</SelectItem>
                  <SelectItem value="consumption">Consommation</SelectItem>
                  <SelectItem value="alerts">Alertes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="medications">Médicaments</SelectItem>
                  <SelectItem value="supplies">Fournitures</SelectItem>
                  <SelectItem value="equipment">Équipements</SelectItem>
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
