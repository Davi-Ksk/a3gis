"use client"

import { useState } from "react"
import { createUser } from "../api/users"
import type { CreateUserRequest } from "../dtos/User.dto"

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateUser = async (userData: CreateUserRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const newUser = await createUser(userData)
      return newUser
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createUser: handleCreateUser,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
