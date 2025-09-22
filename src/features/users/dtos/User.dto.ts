export interface CreateUserRequest {
  nomeCompleto: string
  cpf: string
  email: string
  cargo: string
  login: string
  senha: string
  perfil: "ADMINISTRADOR" | "USUARIO"
}

export interface UpdateUserRequest {
  nomeCompleto: string
  cpf: string
  email: string
  cargo: string
  login: string
  senha?: string
  perfil: "ADMINISTRADOR" | "USUARIO"
}

export interface UserResponse {
  id: number
  nomeCompleto: string
  cpf: string
  email: string
  cargo: string
  login: string
  perfil: "ADMINISTRADOR" | "USUARIO"
  createdAt?: string
  updatedAt?: string
}
