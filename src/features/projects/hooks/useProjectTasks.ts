"use client"

import { useState, useEffect } from "react"
import { getProjectTasks } from "../api/projects"
import type { Task } from "../../../types/global"

export const useProjectTasks = (projectId: number) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const data = await getProjectTasks(projectId)
      setTasks(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tarefas")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
  }
}
