import { ProtectedRoute } from "@/components/auth/protected-route"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { StockAlerts } from "@/components/dashboard/stock-alerts"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Stats Overview */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecentAppointments />
          <StockAlerts />
        </div>

        {/* Additional sections can be added here */}
        <div className="grid gap-6 md:grid-cols-3">{/* Placeholder for future widgets */}</div>
      </div>
    </ProtectedRoute>
  )
}
