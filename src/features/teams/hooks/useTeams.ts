"use client"

import { useState, useEffect } from "react"
import { getTeams } from "../api/teams"
import type { TeamResponse } from "../dtos/Team.dto"

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = async () => {
    try {
      setIsLoading(true)
      const data = await getTeams()
      setTeams(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar equipes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return {
    teams,
    isLoading,
    error,
    refetch: fetchTeams,
  }
}
