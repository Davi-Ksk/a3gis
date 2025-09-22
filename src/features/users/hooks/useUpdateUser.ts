"use client"

import { useState } from "react"
import { updateUser } from "../api/users"
import type { UpdateUserRequest } from "../dtos/User.dto"

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateUser = async (id: number, userData: UpdateUserRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedUser = await updateUser(id, userData)
      return updatedUser
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar usuário")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUser: handleUpdateUser,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
