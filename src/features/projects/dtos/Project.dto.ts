import type { TeamResponse } from "../../teams/dtos/Team.dto";

export enum StatusProjeto {
  PLANEJADO = "PLANEJADO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDO = "CONCLUIDO",
  CANCELADO = "CANCELADO",
}

export interface CreateProjectRequest {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataPrevFim: string;
  responsavelId: number;
}

export interface UpdateProjectRequest {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataPrevFim: string;
  responsavelId: number;
}

export interface ProjectResponse {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataPrevFim: string;
  responsavelId: number;
  responsavel?: {
    id: number;
    nomeCompleto: string;
    email: string;
  };
  status?: StatusProjeto;
  createdAt?: string;
  updatedAt?: string;
  equipes?: TeamResponse[];
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueTasks: number;
}
