import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"

    // Mock stock report data
    const reportData = {
      total_items: 1456,
      low_stock_items: 23,
      expired_items: 5,
      total_value: 245000,
      by_category: [
        { category: "Médicaments", items: 567, value: 145000, low_stock: 12 },
        { category: "Matériel médical", items: 234, value: 78000, low_stock: 8 },
        { category: "Consommables", items: 655, value: 22000, low_stock: 3 },
      ],
      movements: [
        { date: "2024-01-15", type: "Entrée", quantity: 150, value: 12000 },
        { date: "2024-01-14", type: "Sortie", quantity: 89, value: 5600 },
      ],
    }

    if (format === "pdf") {
      const pdfContent = `Rapport de Stock\n\nTotal articles: ${reportData.total_items}\nStock faible: ${reportData.low_stock_items}`
      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=rapport-stock.pdf",
        },
      })
    }

    return NextResponse.json(reportData)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
