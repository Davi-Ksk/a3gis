"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog"
import type { TeamResponse } from "../dtos/Team.dto"
import { useDeleteTeam } from "../hooks/useDeleteTeam"
import { Edit, Trash2, Loader2, Users } from "lucide-react"

interface TeamTableProps {
  teams: TeamResponse[]
  onEdit: (team: TeamResponse) => void
  onRefresh: () => void
}

export const TeamTable: React.FC<TeamTableProps> = ({ teams, onEdit, onRefresh }) => {
  const [deletingTeamId, setDeletingTeamId] = useState<number | null>(null)
  const { deleteTeam, isLoading: isDeleting } = useDeleteTeam()

  const handleDelete = async (teamId: number) => {
    setDeletingTeamId(teamId)
    try {
      await deleteTeam(teamId)
      onRefresh()
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setDeletingTeamId(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Membros</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Nenhuma equipe encontrada
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.nome}</TableCell>
                <TableCell className="max-w-xs truncate">{team.descricao}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <Badge variant="secondary">{team.membroIds?.length || 0} membros</Badge>
                  </div>
                  {team.membros && team.membros.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      {team.membros
                        .slice(0, 2)
                        .map((m) => m.nomeCompleto)
                        .join(", ")}
                      {team.membros.length > 2 && ` +${team.membros.length - 2} mais`}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(team)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isDeleting && deletingTeamId === team.id}>
                          {isDeleting && deletingTeamId === team.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a equipe "{team.nome}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(team.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
