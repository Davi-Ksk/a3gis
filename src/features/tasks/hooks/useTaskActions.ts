"use client"

import { useState } from "react"
import { startTask, completeTask, cancelTask, reopenTask, deleteTask, updateTask } from "../api/tasks"

export const useTaskActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartTask = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await startTask(id)
    } catch (err: any) {
      setError(err.message || "Erro ao iniciar tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteTask = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await completeTask(id)
    } catch (err: any) {
      setError(err.message || "Erro ao concluir tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelTask = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await cancelTask(id)
    } catch (err: any) {
      setError(err.message || "Erro ao cancelar tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleReopenTask = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await reopenTask(id)
    } catch (err: any) {
      setError(err.message || "Erro ao reabrir tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await deleteTask(id)
    } catch (err: any) {
      setError(err.message || "Erro ao excluir tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTask = async (id: number, taskData: UpdateTaskRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      await updateTask(id, taskData)
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar tarefa")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    startTask: handleStartTask,
    completeTask: handleCompleteTask,
    cancelTask: handleCancelTask,
    reopenTask: handleReopenTask,
    deleteTask: handleDeleteTask,
    updateTask: handleUpdateTask,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
