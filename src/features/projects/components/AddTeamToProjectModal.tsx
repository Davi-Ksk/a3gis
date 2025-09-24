import React, { useState } from "react"
import { Button } from "../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { useTeams } from "../../teams/hooks/useTeams"
import { useAddTeamToProject } from "../hooks/useAddTeamToProject"
import { Loader2 } from "lucide-react"

interface AddTeamToProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: number
}

export const AddTeamToProjectModal: React.FC<AddTeamToProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeams()
  const {
    mutate: addTeamToProjectMutation,
    isPending: isAddingTeam,
    error: addTeamError,
  } = useAddTeamToProject()

  const isLoading = teamsLoading || isAddingTeam
  const error = teamsError || addTeamError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeamId) return

    try {
      await addTeamToProjectMutation({ projectId, teamId: Number(selectedTeamId) })
      onSuccess()
      onClose()
    } catch (err) {
      console.error("Failed to add team to project:", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Equipe ao Projeto</DialogTitle>
          <DialogDescription>
            Selecione uma equipe para adicionar a este projeto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.toString()}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <label htmlFor="team" className="text-sm font-medium">
              Equipe
            </label>
            <Select
              value={selectedTeamId || ""}
              onValueChange={setSelectedTeamId}
              disabled={isLoading || teams.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma equipe" />
              </SelectTrigger>
              <SelectContent>
                {teams.length === 0 ? (
                  <SelectItem value="" disabled>
                    Nenhuma equipe disponível
                  </SelectItem>
                ) : (
                  teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedTeamId}>
              {isAddingTeam ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Adicionar Equipe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
