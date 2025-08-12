"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { Search, ArrowRight, Calendar, User } from "lucide-react"

interface TransferHistoryItem {
  id: string
  patient_nin: string
  patient_name: string
  from_hospital: string
  to_hospital: string
  department: string
  transfer_date: string
  completion_date?: string
  status: "completed" | "cancelled" | "failed"
  reason: string
  outcome?: string
}

export function TransferHistory() {
  const [history, setHistory] = useState<TransferHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const { toast } = useToast()

  useEffect(() => {
    fetchTransferHistory()
  }, [])

  const fetchTransferHistory = async () => {
    try {
      // Simulate transfer history data
      const mockHistory: TransferHistoryItem[] = [
        {
          id: "TH001",
          patient_nin: "1234567890123",
          patient_name: "Ahmed Benali",
          from_hospital: "HCA001",
          to_hospital: "HCA002",
          department: "Cardiologie",
          transfer_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          completion_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          status: "completed",
          reason: "Intervention cardiaque spécialisée",
          outcome: "Angioplastie réussie, patient stable",
        },
        {
          id: "TH002",
          patient_nin: "9876543210987",
          patient_name: "Amina Cherif",
          from_hospital: "HCA001",
          to_hospital: "HCA003",
          department: "Neurologie",
          transfer_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          completion_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
          status: "completed",
          reason: "AVC ischémique, thrombolyse",
          outcome: "Thrombolyse effectuée, récupération partielle",
        },
        {
          id: "TH003",
          patient_nin: "5555666677778",
          patient_name: "Karim Boudali",
          from_hospital: "HCA001",
          to_hospital: "HCA004",
          department: "Orthopédie",
          transfer_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
          status: "cancelled",
          reason: "Fracture complexe du fémur",
          outcome: "Transfert annulé - patient stabilisé localement",
        },
        {
          id: "TH004",
          patient_nin: "1111222233334",
          patient_name: "Fatima Khelil",
          from_hospital: "HCA001",
          to_hospital: "HCA005",
          department: "Oncologie",
          transfer_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
          completion_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
          status: "completed",
          reason: "Chimiothérapie spécialisée",
          outcome: "Traitement initié avec succès",
        },
      ]
      setHistory(mockHistory)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des transferts.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient_nin.includes(searchTerm) ||
      item.to_hospital.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    const matchesDate =
      !dateRange || (new Date(item.transfer_date) >= dateRange.from && new Date(item.transfer_date) <= dateRange.to)

    return matchesSearch && matchesStatus && matchesDate
  })

  if (loading) {
    return <div className="flex justify-center p-8">Chargement de l'historique...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historique des transferts</h2>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Patient, NIN, hôpital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des transferts</CardTitle>
          <CardDescription>
            {filteredHistory.length} transfert(s) trouvé(s) sur {history.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <User className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{item.patient_name}</h3>
                      <p className="text-sm text-gray-500">NIN: {item.patient_nin}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{item.to_hospital}</p>
                      <p className="text-sm text-gray-500">{item.department}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm">Motif du transfert</h4>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                  </div>
                  {item.outcome && (
                    <div>
                      <h4 className="font-medium text-sm">Résultat</h4>
                      <p className="text-sm text-gray-600">{item.outcome}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>Transfert: {new Date(item.transfer_date).toLocaleString("fr-FR")}</span>
                  </div>
                  {item.completion_date && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>Terminé: {new Date(item.completion_date).toLocaleString("fr-FR")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">Aucun transfert trouvé avec les filtres actuels.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
