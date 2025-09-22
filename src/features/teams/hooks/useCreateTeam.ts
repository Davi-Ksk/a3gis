"use client"

import { useState } from "react"
import { createTeam } from "../api/teams"
import type { CreateTeamRequest } from "../dtos/Team.dto"

export const useCreateTeam = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateTeam = async (teamData: CreateTeamRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const newTeam = await createTeam(teamData)
      return newTeam
    } catch (err: any) {
      setError(err.message || "Erro ao criar equipe")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createTeam: handleCreateTeam,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
