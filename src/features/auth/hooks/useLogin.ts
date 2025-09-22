"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../providers/AuthProvider"
import { loginUser } from "../api/login"
import type { LoginRequest } from "../dtos/Auth.dto"

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginUser(credentials)

      // Create user object from response
      const user = {
        id: response.user?.id || 0,
        nomeCompleto: response.user?.nomeCompleto || "",
        cpf: "", // Not returned in login response
        email: response.user?.email || "",
        cargo: "", // Not returned in login response
        login: response.user?.login || "",
        perfil: response.user?.perfil || ("USUARIO" as const),
      }

      login(response.token, user)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleLogin,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
