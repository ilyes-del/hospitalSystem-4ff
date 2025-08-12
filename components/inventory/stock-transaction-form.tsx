"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Package } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { InventoryItemWithStock } from "@/lib/types/database"

interface StockTransactionFormProps {
  item?: InventoryItemWithStock
  isOpen: boolean
  onClose: () => void
  onSave: (transactionData: any) => void
}

export function StockTransactionForm({ item, isOpen, onClose, onSave }: StockTransactionFormProps) {
  const [formData, setFormData] = useState({
    transaction_type: "receive" as "receive" | "dispense" | "adjust" | "transfer" | "waste",
    quantity_change: 0,
    batch_number: "",
    expiry_date: undefined as Date | undefined,
    unit_cost: item?.unit_cost || 0,
    supplier: item?.supplier || "",
    reason: "",
    reference_id: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!item || formData.quantity_change === 0) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const transactionData = {
      item_id: item.id,
      hospital_id: item.hospital_id,
      ...formData,
      quantity_change:
        formData.transaction_type === "dispense" || formData.transaction_type === "waste"
          ? -Math.abs(formData.quantity_change)
          : Math.abs(formData.quantity_change),
      expiry_date: formData.expiry_date?.toISOString().split("T")[0],
    }

    onSave(transactionData)
    onClose()
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "receive":
        return "Réception"
      case "dispense":
        return "Distribution"
      case "adjust":
        return "Ajustement"
      case "transfer":
        return "Transfert"
      case "waste":
        return "Perte/Déchet"
      default:
        return type
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction de Stock</DialogTitle>
          <DialogDescription>
            {item ? `Gérer le stock pour: ${item.name}` : "Enregistrer une transaction de stock"}
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Stock actuel: {item.current_stock} {item.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type de transaction *</Label>
            <Select
              value={formData.transaction_type}
              onValueChange={(value) => handleInputChange("transaction_type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receive">Réception</SelectItem>
                <SelectItem value="dispense">Distribution</SelectItem>
                <SelectItem value="adjust">Ajustement</SelectItem>
                <SelectItem value="transfer">Transfert</SelectItem>
                <SelectItem value="waste">Perte/Déchet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity_change || ""}
                onChange={(e) => handleInputChange("quantity_change", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Unit Cost */}
            <div className="space-y-2">
              <Label htmlFor="cost">Prix unitaire (DZD)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_cost || ""}
                onChange={(e) => handleInputChange("unit_cost", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Batch Number (for receive transactions) */}
          {formData.transaction_type === "receive" && (
            <div className="space-y-2">
              <Label htmlFor="batch">Numéro de lot</Label>
              <Input
                id="batch"
                value={formData.batch_number}
                onChange={(e) => handleInputChange("batch_number", e.target.value)}
                placeholder="ex: LOT2024001"
              />
            </div>
          )}

          {/* Expiry Date (for receive transactions) */}
          {formData.transaction_type === "receive" && (
            <div className="space-y-2">
              <Label>Date d'expiration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiry_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiry_date ? (
                      format(formData.expiry_date, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiry_date}
                    onSelect={(date) => handleInputChange("expiry_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Supplier (for receive transactions) */}
          {formData.transaction_type === "receive" && (
            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Nom du fournisseur"
              />
            </div>
          )}

          {/* Reference ID */}
          <div className="space-y-2">
            <Label htmlFor="reference">Référence</Label>
            <Input
              id="reference"
              value={formData.reference_id}
              onChange={(e) => handleInputChange("reference_id", e.target.value)}
              placeholder="Numéro de commande, visite, etc."
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Motif de la transaction..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
