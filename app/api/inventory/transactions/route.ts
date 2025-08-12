import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

// POST /api/inventory/transactions - Create stock transaction
export const POST = withAuth(async (req) => {
  try {
    const user = req.user!
    const transactionData = await req.json()

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.MANAGE_INVENTORY)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Validate required fields
    const { item_id, transaction_type, quantity_change } = transactionData

    if (!item_id || !transaction_type || quantity_change === 0) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    // Mock transaction creation - replace with actual database operations
    const newTransaction = {
      id: `txn_${Date.now()}`,
      ...transactionData,
      performed_by: user.id,
      created_at: new Date().toISOString(),
    }

    console.log("Creating stock transaction:", newTransaction)

    // Update inventory stock levels
    // Create batch records for receive transactions
    // Log audit trail

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Erreur lors de la transaction" }, { status: 500 })
  }
})
