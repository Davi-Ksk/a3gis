"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Checkbox } from "../../../components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import type { CreateTeamRequest, UpdateTeamRequest, TeamResponse } from "../dtos/Team.dto"
import { useCreateTeam } from "../hooks/useCreateTeam"
import { useUpdateTeam } from "../hooks/useUpdateTeam"
import { useUsers } from "../../users/hooks/useUsers"
import { useProjects } from "../../projects/hooks/useProjects"
import { useAddTeamToProject } from "../../projects/hooks/useAddTeamToProject"
import { Loader2 } from "lucide-react"

interface TeamFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  team?: TeamResponse | null
}

export const TeamForm: React.FC<TeamFormProps> = ({ isOpen, onClose, onSuccess, team }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    membroIds: [] as number[],
  })
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const { createTeam, isLoading: isCreating, error: createError } = useCreateTeam()
  const { updateTeam, isLoading: isUpdating, error: updateError } = useUpdateTeam()
  const { users } = useUsers()
  const { projects } = useProjects()
  const { mutate: addTeamToProjectMutation, isPending: isAddingTeam } = useAddTeamToProject()

  const isEditing = !!team
  const isLoading = isCreating || isUpdating || isAddingTeam
  const error = createError || updateError

  useEffect(() => {
    if (team) {
      setFormData({
        nome: team.nome,
        descricao: team.descricao,
        membroIds: team.membroIds || [],
      })
      // If editing, we might want to pre-select the project the team is already associated with
      // This would require fetching team-project associations, which is not currently available
    } else {
      setFormData({
        nome: "",
        descricao: "",
        membroIds: [],
      })
      setSelectedProjectId(null)
    }
  }, [team, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && team) {
        await updateTeam(team.id, formData as UpdateTeamRequest)
      } else {
        const newTeam = await createTeam(formData as CreateTeamRequest)
        if (selectedProjectId && newTeam) {
          await addTeamToProjectMutation({ projectId: Number(selectedProjectId), teamId: newTeam.id })
        }
      }
      onSuccess()
      onClose()
    } catch (error) {
      // Error is handled by the hooks
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMemberToggle = (userId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      membroIds: checked ? [...prev.membroIds, userId] : prev.membroIds.filter((id) => id !== userId),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Equipe" : "Criar Nova Equipe"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da equipe abaixo."
              : "Preencha as informações para criar uma nova equipe."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome da Equipe
            </label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              rows={3}
            />
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <label htmlFor="projeto" className="text-sm font-medium">
                Adicionar a um Projeto (Opcional)
              </label>
              <Select
                value={selectedProjectId || ""}
                onValueChange={setSelectedProjectId}
                disabled={isLoading || projects.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 ? (
                    <SelectItem value="" disabled>
                      Nenhum projeto disponível
                    </SelectItem>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Membros da Equipe</label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum usuário disponível</p>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={formData.membroIds.includes(user.id)}
                        onCheckedChange={(checked) => handleMemberToggle(user.id, checked as boolean)}
                        disabled={isLoading}
                      />
                      <label htmlFor={`user-${user.id}`} className="text-sm cursor-pointer flex-1">
                        <div>
                          <span className="font-medium">{user.nomeCompleto}</span>
                          <span className="text-gray-500 ml-2">({user.cargo})</span>
                        </div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">{formData.membroIds.length} membro(s) selecionado(s)</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : isEditing ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
