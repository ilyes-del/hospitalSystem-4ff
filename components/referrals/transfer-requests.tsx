"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, ArrowRight, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface TransferRequest {
  id: string
  patient_nin: string
  patient_name: string
  from_hospital: string
  to_hospital: string
  department: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "approved" | "rejected" | "completed"
  reason: string
  medical_summary: string
  requested_by: string
  requested_at: string
  approved_by?: string
  approved_at?: string
}

export function TransferRequests() {
  const [requests, setRequests] = useState<TransferRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    patient_nin: "",
    patient_name: "",
    to_hospital: "",
    department: "",
    priority: "medium",
    reason: "",
    medical_summary: "",
  })

  useEffect(() => {
    fetchTransferRequests()
  }, [])

  const fetchTransferRequests = async () => {
    try {
      const response = await fetch("/api/referrals/transfers")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de transfert.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/referrals/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Demande créée",
          description: "La demande de transfert a été soumise avec succès.",
        })
        setDialogOpen(false)
        resetForm()
        fetchTransferRequests()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande de transfert.",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/referrals/transfers/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la demande a été modifié avec succès.",
        })
        fetchTransferRequests()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      patient_nin: "",
      patient_name: "",
      to_hospital: "",
      department: "",
      priority: "medium",
      reason: "",
      medical_summary: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des demandes de transfert...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Demandes de transfert</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle demande de transfert</DialogTitle>
              <DialogDescription>
                Créez une demande de transfert de patient vers un autre établissement
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_nin">NIN du patient</Label>
                  <Input
                    id="patient_nin"
                    value={formData.patient_nin}
                    onChange={(e) => setFormData({ ...formData, patient_nin: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Nom du patient</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="to_hospital">Hôpital de destination</Label>
                  <Select
                    value={formData.to_hospital}
                    onValueChange={(value) => setFormData({ ...formData, to_hospital: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un hôpital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HCA002">Hôpital Universitaire d'Oran</SelectItem>
                      <SelectItem value="HCA003">CHU Mustapha Pacha</SelectItem>
                      <SelectItem value="HCA004">Hôpital Militaire Ain Naadja</SelectItem>
                      <SelectItem value="HCA005">Hôpital de Constantine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Service demandé</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiologie">Cardiologie</SelectItem>
                      <SelectItem value="neurologie">Neurologie</SelectItem>
                      <SelectItem value="oncologie">Oncologie</SelectItem>
                      <SelectItem value="chirurgie">Chirurgie spécialisée</SelectItem>
                      <SelectItem value="pediatrie">Pédiatrie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motif du transfert</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_summary">Résumé médical</Label>
                <Textarea
                  id="medical_summary"
                  value={formData.medical_summary}
                  onChange={(e) => setFormData({ ...formData, medical_summary: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer la demande</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <CardTitle className="text-lg">{request.patient_name}</CardTitle>
                    <CardDescription>NIN: {request.patient_nin}</CardDescription>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{request.to_hospital}</p>
                    <p className="text-sm text-gray-500">{request.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1">{request.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Motif du transfert</h4>
                  <p className="text-sm text-gray-600">{request.reason}</p>
                </div>
                <div>
                  <h4 className="font-medium">Résumé médical</h4>
                  <p className="text-sm text-gray-600">{request.medical_summary}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Demandé par: {request.requested_by}</span>
                  <span>Le: {new Date(request.requested_at).toLocaleString("fr-FR")}</span>
                </div>
                {request.status === "pending" && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                      onClick={() => handleStatusUpdate(request.id, "approved")}
                    >
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => handleStatusUpdate(request.id, "rejected")}
                    >
                      Rejeter
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucune demande de transfert trouvée.</div>
        )}
      </div>
    </div>
  )
}
