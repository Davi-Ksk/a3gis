"use client"

import { useState } from "react"
import { createProject } from "../api/projects"
import type { CreateProjectRequest } from "../dtos/Project.dto"

export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateProject = async (projectData: CreateProjectRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const newProject = await createProject(projectData)
      return newProject
    } catch (err: any) {
      setError(err.message || "Erro ao criar projeto")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createProject: handleCreateProject,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
