export interface CreateTaskRequest {
  titulo: string
  descricao: string
  dataFimPrevista: string
  projetoId: number
  responsavelId: number
}

export interface UpdateTaskRequest {
  titulo: string
  descricao: string
  dataFimPrevista: string
  responsavelId: number
}

export interface TaskResponse {
  id: number
  titulo: string
  descricao: string
  dataFimPrevista: string
  projetoId: number
  responsavelId: number
  projeto?: {
    id: number
    nome: string
  }
  responsavel?: {
    id: number
    nomeCompleto: string
    email: string
  }
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO"
  createdAt?: string
  updatedAt?: string
}

export interface TaskHistoryResponse {
  id: number
  tarefaId: number
  statusAnterior: string
  statusNovo: string
  dataAlteracao: string
  usuarioId: number
  usuario?: {
    id: number
    nomeCompleto: string
  }
}
