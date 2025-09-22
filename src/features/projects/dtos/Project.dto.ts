export interface CreateProjectRequest {
  nome: string
  descricao: string
  dataInicio: string
  dataPrevFim: string
  responsavelId: number
}

export interface UpdateProjectRequest {
  nome: string
  descricao: string
  dataInicio: string
  dataPrevFim: string
  responsavelId: number
}

export interface ProjectResponse {
  id: number
  nome: string
  descricao: string
  dataInicio: string
  dataPrevFim: string
  responsavelId: number
  responsavel?: {
    id: number
    nomeCompleto: string
    email: string
  }
  status?: "ATIVO" | "CONCLUIDO" | "CANCELADO"
  createdAt?: string
  updatedAt?: string
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  overdueTasks: number
}
