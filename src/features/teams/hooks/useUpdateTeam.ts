"use client"

import { useState } from "react"
import { updateTeam } from "../api/teams"
import type { UpdateTeamRequest } from "../dtos/Team.dto"

export const useUpdateTeam = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateTeam = async (id: number, teamData: UpdateTeamRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedTeam = await updateTeam(id, teamData)
      return updatedTeam
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar equipe")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateTeam: handleUpdateTeam,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
