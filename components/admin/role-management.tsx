"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus, Edit, Trash2, Shield } from "lucide-react"
import { PERMISSIONS } from "@/lib/auth/types"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  const allPermissions = Object.values(PERMISSIONS)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles")
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les rôles.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingRole ? `/api/admin/roles/${editingRole.id}` : "/api/admin/roles"
      const method = editingRole ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingRole ? "Rôle modifié" : "Rôle créé",
          description: "L'opération a été effectuée avec succès.",
        })
        setDialogOpen(false)
        resetForm()
        fetchRoles()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le rôle.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (roleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) return

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Rôle supprimé",
          description: "Le rôle a été supprimé avec succès.",
        })
        fetchRoles()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rôle.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
    })
    setEditingRole(null)
  }

  const openEditDialog = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setDialogOpen(true)
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      })
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des rôles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des rôles</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rôle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Modifier le rôle" : "Nouveau rôle"}</DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Modifiez les informations du rôle"
                  : "Créez un nouveau rôle avec des permissions spécifiques"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du rôle</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded p-3">
                  {allPermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={formData.permissions.includes(permission)}
                        onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace(/_/g, " ").toLowerCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingRole ? "Modifier" : "Créer"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>{role.name}</CardTitle>
                  {role.isSystem && <Badge variant="secondary">Système</Badge>}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{role.userCount} utilisateur(s)</Badge>
                  {!role.isSystem && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Permissions ({role.permissions.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace(/_/g, " ").toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
