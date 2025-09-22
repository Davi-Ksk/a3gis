export interface CreateTeamRequest {
  nome: string
  descricao: string
  membroIds: number[]
}

export interface UpdateTeamRequest {
  nome: string
  descricao: string
  membroIds: number[]
}

export interface TeamResponse {
  id: number
  nome: string
  descricao: string
  membroIds: number[]
  membros?: {
    id: number
    nomeCompleto: string
    email: string
    cargo: string
  }[]
  createdAt?: string
  updatedAt?: string
}
