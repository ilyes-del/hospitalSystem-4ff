"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Calendar, AlertTriangle } from "lucide-react"
import type { InventoryItemWithStock, StockBatch } from "@/lib/types/database"

interface BatchManagementProps {
  item?: InventoryItemWithStock
  isOpen: boolean
  onClose: () => void
  onDispense?: (batch: StockBatch, quantity: number) => void
}

export function BatchManagement({ item, isOpen, onClose, onDispense }: BatchManagementProps) {
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null)
  const [dispenseQuantity, setDispenseQuantity] = useState(1)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0 // Expiring within 90 days
  }

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  const getBatchStatus = (batch: StockBatch) => {
    if (batch.status === "recalled") return { label: "Rappelé", color: "bg-red-100 text-red-800" }
    if (batch.expiry_date && isExpired(batch.expiry_date)) return { label: "Expiré", color: "bg-red-100 text-red-800" }
    if (batch.expiry_date && isExpiringSoon(batch.expiry_date))
      return { label: "Expire bientôt", color: "bg-orange-100 text-orange-800" }
    if (batch.quantity === 0) return { label: "Épuisé", color: "bg-gray-100 text-gray-800" }
    return { label: "Disponible", color: "bg-green-100 text-green-800" }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
    }).format(amount)
  }

  const handleDispense = (batch: StockBatch) => {
    if (dispenseQuantity > 0 && dispenseQuantity <= batch.quantity) {
      onDispense?.(batch, dispenseQuantity)
      setSelectedBatch(null)
      setDispenseQuantity(1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Gestion des Lots</span>
          </DialogTitle>
          <DialogDescription>
            {item ? `Lots disponibles pour: ${item.name}` : "Gestion des lots de stock"}
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            {/* Item Summary */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Stock total: {item.current_stock} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Valeur totale</p>
                    <p className="font-medium">{formatCurrency(item.current_stock * (item.unit_cost || 0))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Batches Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lots en stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro de lot</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Date d'expiration</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead>Fournisseur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.batches?.map((batch) => {
                        const status = getBatchStatus(batch)
                        return (
                          <TableRow key={batch.id}>
                            <TableCell className="font-medium">{batch.batch_number}</TableCell>
                            <TableCell>
                              {batch.quantity} {item.unit}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{batch.expiry_date ? formatDate(batch.expiry_date) : "-"}</span>
                                {batch.expiry_date && isExpiringSoon(batch.expiry_date) && (
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                )}
                                {batch.expiry_date && isExpired(batch.expiry_date) && (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{batch.unit_cost ? formatCurrency(batch.unit_cost) : "-"}</TableCell>
                            <TableCell>{batch.supplier || "-"}</TableCell>
                            <TableCell>
                              <Badge className={status.color}>{status.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {batch.quantity > 0 && status.label === "Disponible" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedBatch(batch)}
                                  disabled={batch.quantity === 0}
                                >
                                  Distribuer
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {(!item.batches || item.batches.length === 0) && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun lot en stock</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dispense Dialog */}
        {selectedBatch && (
          <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Distribuer du stock</DialogTitle>
                <DialogDescription>Lot: {selectedBatch.batch_number}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Quantité disponible</p>
                  <p className="text-lg font-medium">
                    {selectedBatch.quantity} {item?.unit}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantité à distribuer</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedBatch.quantity}
                    value={dispenseQuantity}
                    onChange={(e) => setDispenseQuantity(Number.parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedBatch(null)}>
                    Annuler
                  </Button>
                  <Button onClick={() => handleDispense(selectedBatch)}>Confirmer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
