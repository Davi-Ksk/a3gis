"use client"

import { useQuery } from "@tanstack/react-query"
import { getProjects } from "../api/projects"

export const useProjects = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  return {
    projects: data || [],
        isLoading,
    error: error ? error.message : null,
    refetch,
  }
}
