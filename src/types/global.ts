import { UserProfile } from "@/features/users/dtos/User.dto";
import { StatusTarefa } from "@/features/tasks/dtos/Task.dto";

export interface User {
  id: number;
  nomeCompleto: string;
  cpf: string;
  email: string;
  cargo: string;
  login: string;
  perfil: UserProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataPrevFim: string;
  responsavelId: number;
  responsavel?: User;
  status?: "ATIVO" | "CONCLUIDO" | "CANCELADO";
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id: number;
  nome: string;
  descricao: string;
  membroIds: number[];
  membros?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  dataFimPrevista: string;
  projetoId: number;
  responsavelId: number;
  projeto?: Project;
  responsavel?: User;
  status: StatusTarefa;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TaskHistory {
  id: number;
  tarefaId: number;
  statusAnterior: string;
  statusNovo: string;
  dataAlteracao: string;
  usuarioId: number;
  usuario?: User;
}
