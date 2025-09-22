import api from "../../../lib/axios"
import type { LoginRequest, LoginResponse } from "../dtos/Auth.dto"

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post("/auth/login", credentials)
    return response.data
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Erro ao fazer login",
      status: error.response?.status || 500,
    }
  }
}

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await api.get("/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.status === 200
  } catch (error) {
    return false
  }
}
