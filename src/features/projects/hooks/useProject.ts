"use client"

import { useState, useEffect } from "react"
import { getProject } from "../api/projects"
import type { ProjectResponse } from "../dtos/Project.dto"

export const useProject = (id: number) => {
  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = async () => {
    try {
      setIsLoading(true)
      const data = await getProject(id)
      setProject(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar projeto")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  }
}
