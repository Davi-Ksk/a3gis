export interface LoginRequest {
  login: string
  senha: string
}

export interface LoginResponse {
  token: string
  user?: {
    id: number
    nomeCompleto: string
    email: string
    login: string
    perfil: "ADMINISTRADOR" | "USUARIO"
  }
}

export interface AuthError {
  message: string
  status: number
}
