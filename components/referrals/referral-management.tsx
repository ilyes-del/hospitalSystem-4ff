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
import { Plus, User, Calendar, FileText } from "lucide-react"

interface Referral {
  id: string
  patient_nin: string
  patient_name: string
  from_department: string
  to_department: string
  referring_doctor: string
  specialist: string
  reason: string
  urgency: "routine" | "urgent" | "emergency"
  status: "pending" | "scheduled" | "completed" | "cancelled"
  appointment_date?: string
  notes?: string
  created_at: string
}

export function ReferralManagement() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    patient_nin: "",
    patient_name: "",
    to_department: "",
    specialist: "",
    reason: "",
    urgency: "routine",
    notes: "",
  })

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    try {
      const response = await fetch("/api/referrals/internal")
      if (response.ok) {
        const data = await response.json()
        setReferrals(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les référencements.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/referrals/internal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Référencement créé",
          description: "Le référencement a été créé avec succès.",
        })
        setDialogOpen(false)
        resetForm()
        fetchReferrals()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le référencement.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      patient_nin: "",
      patient_name: "",
      to_department: "",
      specialist: "",
      reason: "",
      urgency: "routine",
      notes: "",
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      case "routine":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des référencements...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Référencements internes</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau référencement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouveau référencement</DialogTitle>
              <DialogDescription>Référer un patient vers un spécialiste ou un autre service</DialogDescription>
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
                  <Label htmlFor="to_department">Service de destination</Label>
                  <Select
                    value={formData.to_department}
                    onValueChange={(value) => setFormData({ ...formData, to_department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiologie">Cardiologie</SelectItem>
                      <SelectItem value="neurologie">Neurologie</SelectItem>
                      <SelectItem value="orthopédie">Orthopédie</SelectItem>
                      <SelectItem value="dermatologie">Dermatologie</SelectItem>
                      <SelectItem value="ophtalmologie">Ophtalmologie</SelectItem>
                      <SelectItem value="oto-rhino">ORL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialist">Spécialiste demandé</Label>
                  <Input
                    id="specialist"
                    value={formData.specialist}
                    onChange={(e) => setFormData({ ...formData, specialist: e.target.value })}
                    placeholder="Nom du médecin spécialiste"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgence</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Urgence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motif du référencement</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes cliniques</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le référencement</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {referrals.map((referral) => (
          <Card key={referral.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{referral.patient_name}</CardTitle>
                    <CardDescription>NIN: {referral.patient_nin}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getUrgencyColor(referral.urgency)}>{referral.urgency}</Badge>
                  <Badge className={getStatusColor(referral.status)}>{referral.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>De:</strong> {referral.from_department} → <strong>Vers:</strong> {referral.to_department}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Médecin référent:</strong> {referral.referring_doctor}
                    </span>
                  </div>
                  {referral.specialist && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Spécialiste:</strong> {referral.specialist}
                      </span>
                    </div>
                  )}
                  {referral.appointment_date && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>RDV:</strong> {new Date(referral.appointment_date).toLocaleString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Motif</h4>
                    <p className="text-sm text-gray-600">{referral.reason}</p>
                  </div>
                  {referral.notes && (
                    <div>
                      <h4 className="font-medium text-sm">Notes cliniques</h4>
                      <p className="text-sm text-gray-600">{referral.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t text-xs text-gray-500">
                Créé le: {new Date(referral.created_at).toLocaleString("fr-FR")}
              </div>
            </CardContent>
          </Card>
        ))}

        {referrals.length === 0 && <div className="text-center py-8 text-gray-500">Aucun référencement trouvé.</div>}
      </div>
    </div>
  )
}
