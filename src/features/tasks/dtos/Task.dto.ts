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
  status: StatusTarefa
  createdAt?: string
  updatedAt?: string
}

export interface TaskHistoryResponse {
  id: number
  tarefaId: number
  statusAnterior: StatusTarefa
  statusNovo: StatusTarefa
  dataAlteracao: string
  usuarioId: number
  usuario?: {
    id: number
    nomeCompleto: string
  }
}

export enum StatusTarefa {
  PENDENTE = "PENDENTE",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
  CANCELADA = "CANCELADA",
}