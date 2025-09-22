"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { UserTable } from "../features/users/components/UserTable"
import { UserForm } from "../features/users/components/UserForm"
import { useUsers } from "../features/users/hooks/useUsers"
import type { UserResponse } from "../features/users/dtos/User.dto"
import { Plus, Users, Loader2 } from "lucide-react"

export const UsersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null)
  const { users, isLoading, error, refetch } = useUsers()

  const handleCreateUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  const handleFormSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Usuários ({users.length})
          </CardTitle>
          <CardDescription>Lista de todos os usuários cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable users={users} onEdit={handleEditUser} onRefresh={refetch} />
        </CardContent>
      </Card>

      <UserForm isOpen={isFormOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} user={editingUser} />
    </div>
  )
}
