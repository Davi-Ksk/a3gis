"use client"

import { useState, useEffect } from "react"
import { getUsers } from "../api/users"
import type { UserResponse } from "../dtos/User.dto"

export const useUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await getUsers()
      setUsers(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar usuários")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  }
}
