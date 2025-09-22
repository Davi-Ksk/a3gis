"use client"

import { useState } from "react"
import { createTask } from "../api/tasks"
import type { CreateTaskRequest } from "../dtos/Task.dto"

export const useCreateTask = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const newTask = await createTask(taskData)
      return newTask
    } catch (err: any) {
      setError(err.message || "Erro ao criar tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createTask: handleCreateTask,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
