"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Search, Plus, Edit, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import type { InventoryItemWithStock } from "@/lib/types/database"

// Mock data - in real app, this would come from API
const mockInventoryItems: InventoryItemWithStock[] = [
  {
    id: "1",
    hospital_id: "hospital-1",
    name: "Paracétamol 500mg",
    category: "medication",
    unit: "boîtes",
    min_threshold: 50,
    max_threshold: 200,
    current_stock: 15,
    unit_cost: 2.5,
    supplier: "Pharma Algérie",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    batches: [
      {
        id: "batch-1",
        item_id: "1",
        batch_number: "PAR2024001",
        quantity: 10,
        unit_cost: 2.5,
        expiry_date: "2025-06-30",
        received_date: "2024-01-15",
        supplier: "Pharma Algérie",
        status: "available",
        created_at: "2024-01-15T00:00:00Z",
      },
      {
        id: "batch-2",
        item_id: "1",
        batch_number: "PAR2024002",
        quantity: 5,
        unit_cost: 2.5,
        expiry_date: "2024-12-31",
        received_date: "2024-01-10",
        supplier: "Pharma Algérie",
        status: "available",
        created_at: "2024-01-10T00:00:00Z",
      },
    ],
  },
  {
    id: "2",
    hospital_id: "hospital-1",
    name: "Seringues jetables 5ml",
    category: "consumable",
    unit: "pièces",
    min_threshold: 100,
    max_threshold: 500,
    current_stock: 80,
    unit_cost: 0.15,
    supplier: "MedSupply",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    batches: [
      {
        id: "batch-3",
        item_id: "2",
        batch_number: "SER2024001",
        quantity: 80,
        unit_cost: 0.15,
        expiry_date: "2026-01-31",
        received_date: "2024-01-05",
        supplier: "MedSupply",
        status: "available",
        created_at: "2024-01-05T00:00:00Z",
      },
    ],
  },
  {
    id: "3",
    hospital_id: "hospital-1",
    name: "Amoxicilline 250mg",
    category: "medication",
    unit: "boîtes",
    min_threshold: 30,
    max_threshold: 150,
    current_stock: 45,
    unit_cost: 8.75,
    supplier: "Antibio Med",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    batches: [
      {
        id: "batch-4",
        item_id: "3",
        batch_number: "AMX2024001",
        quantity: 45,
        unit_cost: 8.75,
        expiry_date: "2025-03-15",
        received_date: "2024-01-12",
        supplier: "Antibio Med",
        status: "available",
        created_at: "2024-01-12T00:00:00Z",
      },
    ],
  },
]

const categoryColors = {
  medication: "bg-blue-100 text-blue-800",
  consumable: "bg-green-100 text-green-800",
  equipment: "bg-purple-100 text-purple-800",
}

const getStockStatus = (current: number, min: number, max?: number) => {
  if (current <= min * 0.5) return { status: "critical", color: "text-red-600", icon: AlertTriangle }
  if (current <= min) return { status: "low", color: "text-orange-600", icon: TrendingDown }
  if (max && current >= max * 0.9) return { status: "high", color: "text-blue-600", icon: TrendingUp }
  return { status: "normal", color: "text-green-600", icon: Package }
}

interface InventoryListProps {
  onEdit?: (item: InventoryItemWithStock) => void
  onCreateNew?: () => void
  onViewBatches?: (item: InventoryItemWithStock) => void
}

export function InventoryList({ onEdit, onCreateNew, onViewBatches }: InventoryListProps) {
  const [items] = useState<InventoryItemWithStock[]>(mockInventoryItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    const stockStatus = getStockStatus(item.current_stock, item.min_threshold, item.max_threshold).status
    const matchesStatus = statusFilter === "all" || stockStatus === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Inventaire</CardTitle>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom ou fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="medication">Médicaments</SelectItem>
              <SelectItem value="consumable">Consommables</SelectItem>
              <SelectItem value="equipment">Équipements</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Statut stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock Actuel</TableHead>
                <TableHead>Seuils</TableHead>
                <TableHead>Prix Unitaire</TableHead>
                <TableHead>Valeur Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.current_stock, item.min_threshold, item.max_threshold)
                const StatusIcon = stockStatus.icon
                const totalValue = item.current_stock * (item.unit_cost || 0)

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.supplier}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={categoryColors[item.category]}>
                        {item.category === "medication" && "Médicament"}
                        {item.category === "consumable" && "Consommable"}
                        {item.category === "equipment" && "Équipement"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${stockStatus.color}`} />
                        <span className="font-medium">
                          {item.current_stock} {item.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Min: {item.min_threshold}</p>
                        {item.max_threshold && <p>Max: {item.max_threshold}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{item.unit_cost ? formatCurrency(item.unit_cost) : "-"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(totalValue)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          stockStatus.status === "critical"
                            ? "bg-red-100 text-red-800"
                            : stockStatus.status === "low"
                              ? "bg-orange-100 text-orange-800"
                              : stockStatus.status === "high"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {stockStatus.status === "critical" && "Critique"}
                        {stockStatus.status === "low" && "Faible"}
                        {stockStatus.status === "normal" && "Normal"}
                        {stockStatus.status === "high" && "Élevé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewBatches?.(item)}>
                          Lots
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEdit?.(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun article trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
