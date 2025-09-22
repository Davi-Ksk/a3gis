"use client"

import { useState, useEffect } from "react"
import { getProjects } from "../api/projects"
import type { ProjectResponse } from "../dtos/Project.dto"

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const data = await getProjects()
      setProjects(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar projetos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  }
}
