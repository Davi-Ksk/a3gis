"use client"

import { useState } from "react"
import { startProject, completeProject, cancelProject } from "../api/projects"

export const useProjectActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartProject = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await startProject(id)
    } catch (err: any) {
      setError(err.message || "Erro ao iniciar projeto")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteProject = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await completeProject(id)
    } catch (err: any) {
      setError(err.message || "Erro ao concluir projeto")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelProject = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await cancelProject(id)
    } catch (err: any) {
      setError(err.message || "Erro ao cancelar projeto")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    startProject: handleStartProject,
    completeProject: handleCompleteProject,
    cancelProject: handleCancelProject,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}