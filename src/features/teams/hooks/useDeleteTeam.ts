"use client"

import { useState } from "react"
import { deleteTeam } from "../api/teams"

export const useDeleteTeam = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteTeam = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await deleteTeam(id)
    } catch (err: any) {
      setError(err.message || "Erro ao deletar equipe")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteTeam: handleDeleteTeam,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
