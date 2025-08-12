import { ProtectedRoute } from "@/components/auth/protected-route"
import { DispensingInterface } from "@/components/pharmacy/dispensing-interface"
import { PERMISSIONS } from "@/lib/auth/types"

export default function PharmacyPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_INVENTORY}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacie</h1>
            <p className="text-gray-600">Distribution des médicaments et gestion des ordonnances</p>
          </div>
        </div>

        <DispensingInterface />
      </div>
    </ProtectedRoute>
  )
}
