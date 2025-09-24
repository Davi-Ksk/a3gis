"use client"

import { useQuery } from "@tanstack/react-query"
import { getTeams } from "../api/teams"
import type { TeamResponse } from "../dtos/Team.dto"

export const useTeams = () => {
  const { data, isLoading, error, refetch } = useQuery<TeamResponse[], Error>({
    queryKey: ["teams"],
    queryFn: getTeams,
  })

  return {
    teams: data || [],
    isLoading,
    error: error ? error.message : null,
    refetch,
  }
}
