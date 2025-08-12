import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

// GET /api/inventory - List inventory items
export const GET = withAuth(async (req) => {
  try {
    const user = req.user!
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const status = searchParams.get("status")

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.VIEW_INVENTORY)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock data - replace with actual database query
    const mockItems = [
      {
        id: "1",
        hospital_id: user.hospital_id,
        name: "Paracétamol 500mg",
        category: "medication",
        current_stock: 15,
        min_threshold: 50,
        unit_cost: 2.5,
      },
    ]

    return NextResponse.json({
      items: mockItems,
      pagination: {
        page,
        limit,
        total: mockItems.length,
        pages: Math.ceil(mockItems.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
})

// POST /api/inventory - Create inventory item
export const POST = withAuth(async (req) => {
  try {
    const user = req.user!
    const itemData = await req.json()

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.MANAGE_INVENTORY)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Validate required fields
    const { name, category, unit, min_threshold } = itemData

    if (!name || !category || !unit || min_threshold === undefined) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    // Mock creation - replace with actual database insert
    const newItem = {
      id: `item_${Date.now()}`,
      ...itemData,
      hospital_id: user.hospital_id,
      current_stock: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Creating inventory item:", newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
})
