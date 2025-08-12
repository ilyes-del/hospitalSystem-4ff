"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, Pill } from "lucide-react"

interface StockAlert {
  id: string
  item_name: string
  current_stock: number
  min_threshold: number
  category: "medication" | "consumable" | "equipment"
  severity: "low" | "critical"
}

const mockAlerts: StockAlert[] = [
  {
    id: "1",
    item_name: "Paracétamol 500mg",
    current_stock: 15,
    min_threshold: 50,
    category: "medication",
    severity: "critical",
  },
  {
    id: "2",
    item_name: "Seringues jetables 5ml",
    current_stock: 80,
    min_threshold: 100,
    category: "consumable",
    severity: "low",
  },
  {
    id: "3",
    item_name: "Gants latex (boîte)",
    current_stock: 25,
    min_threshold: 20,
    category: "consumable",
    severity: "low",
  },
]

const categoryIcons = {
  medication: Pill,
  consumable: Package,
  equipment: Package,
}

const severityColors = {
  low: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
}

export function StockAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
          Alertes Stock
        </CardTitle>
        <Button variant="outline" size="sm">
          Gérer le stock
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const Icon = categoryIcons[alert.category]
            return (
              <div key={alert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{alert.item_name}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {alert.current_stock} / Min: {alert.min_threshold}
                    </p>
                  </div>
                </div>
                <Badge className={severityColors[alert.severity]}>
                  {alert.severity === "low" ? "Faible" : "Critique"}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
