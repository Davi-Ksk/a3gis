"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { TeamTable } from "../features/teams/components/TeamTable"
import { TeamForm } from "../features/teams/components/TeamForm"
import { useTeams } from "../features/teams/hooks/useTeams"
import type { TeamResponse } from "../features/teams/dtos/Team.dto"
import { Plus, Users, Loader2 } from "lucide-react"

export const TeamsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<TeamResponse | null>(null)
  const { teams, isLoading, error, refetch } = useTeams()

  const handleCreateTeam = () => {
    setEditingTeam(null)
    setIsFormOpen(true)
  }

  const handleEditTeam = (team: TeamResponse) => {
    setEditingTeam(team)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTeam(null)
  }

  const handleFormSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando equipes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Equipes</h1>
          <p className="text-gray-600">Gerencie as equipes do sistema</p>
        </div>
        <Button onClick={handleCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Equipe
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
            Equipes ({teams.length})
          </CardTitle>
          <CardDescription>Lista de todas as equipes cadastradas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamTable teams={teams} onEdit={handleEditTeam} onRefresh={refetch} />
        </CardContent>
      </Card>

      <TeamForm isOpen={isFormOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} team={editingTeam} />
    </div>
  )
}
