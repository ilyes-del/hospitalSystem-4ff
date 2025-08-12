"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { InventoryList } from "@/components/inventory/inventory-list"
import { StockTransactionForm } from "@/components/inventory/stock-transaction-form"
import { BatchManagement } from "@/components/inventory/batch-management"
import { PERMISSIONS } from "@/lib/auth/types"
import type { InventoryItemWithStock } from "@/lib/types/database"

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<InventoryItemWithStock | undefined>()
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isBatchManagementOpen, setIsBatchManagementOpen] = useState(false)

  const handleCreateNew = () => {
    // Open item creation form
    console.log("Create new inventory item")
  }

  const handleEdit = (item: InventoryItemWithStock) => {
    setSelectedItem(item)
    setIsTransactionFormOpen(true)
  }

  const handleViewBatches = (item: InventoryItemWithStock) => {
    setSelectedItem(item)
    setIsBatchManagementOpen(true)
  }

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      console.log("Saving transaction:", transactionData)
      // API call to save transaction
      // Refresh inventory list
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  const handleDispense = async (batch: any, quantity: number) => {
    try {
      console.log("Dispensing from batch:", batch, "quantity:", quantity)
      // API call to record dispensing
      // Refresh inventory and batches
    } catch (error) {
      console.error("Error dispensing:", error)
    }
  }

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_INVENTORY}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
            <p className="text-gray-600">Gérez l'inventaire et les transactions de stock</p>
          </div>
        </div>

        <InventoryList onEdit={handleEdit} onCreateNew={handleCreateNew} onViewBatches={handleViewBatches} />

        <StockTransactionForm
          item={selectedItem}
          isOpen={isTransactionFormOpen}
          onClose={() => setIsTransactionFormOpen(false)}
          onSave={handleSaveTransaction}
        />

        <BatchManagement
          item={selectedItem}
          isOpen={isBatchManagementOpen}
          onClose={() => setIsBatchManagementOpen(false)}
          onDispense={handleDispense}
        />
      </div>
    </ProtectedRoute>
  )
}
