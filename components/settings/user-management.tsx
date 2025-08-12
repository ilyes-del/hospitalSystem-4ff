"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Edit, Trash2, UserPlus } from "lucide-react"
import type { User } from "@/lib/types/database"

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    role: "",
    department: "",
    password: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingUser ? `/api/users/${editingUser.user_id}` : "/api/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingUser ? "Utilisateur modifié" : "Utilisateur créé",
          description: "L'opération a été effectuée avec succès.",
        })
        setDialogOpen(false)
        resetForm()
        fetchUsers()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'utilisateur.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès.",
        })
        fetchUsers()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      full_name: "",
      email: "",
      role: "",
      department: "",
      password: "",
    })
    setEditingUser(null)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      full_name: user.full_name,
      email: user.email || "",
      role: user.role,
      department: user.department || "",
      password: "",
    })
    setDialogOpen(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "nurse":
        return "bg-green-100 text-green-800"
      case "pharmacist":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Gérez les comptes utilisateurs et leurs permissions</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
                  <DialogDescription>
                    {editingUser ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nom complet</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="doctor">Médecin</SelectItem>
                          <SelectItem value="nurse">Infirmier</SelectItem>
                          <SelectItem value="pharmacist">Pharmacien</SelectItem>
                          <SelectItem value="receptionist">Réceptionniste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Urgences">Urgences</SelectItem>
                          <SelectItem value="Cardiologie">Cardiologie</SelectItem>
                          <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                          <SelectItem value="Chirurgie">Chirurgie</SelectItem>
                          <SelectItem value="Radiologie">Radiologie</SelectItem>
                          <SelectItem value="Pharmacie">Pharmacie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">{editingUser ? "Modifier" : "Créer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">{user.full_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user.full_name}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                    {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  {user.department && <Badge variant="outline">{user.department}</Badge>}
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(user.user_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
