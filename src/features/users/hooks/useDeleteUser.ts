"use client"

import { useState } from "react"
import { deleteUser } from "../api/users"

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteUser = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      await deleteUser(id)
    } catch (err: any) {
      setError(err.message || "Erro ao deletar usuário")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteUser: handleDeleteUser,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
