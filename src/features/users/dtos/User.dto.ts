export interface CreateUserRequest {
  nomeCompleto: string;
  cpf: string;
  email: string;
  cargo: string;
  login: string;
  senha: string;
  perfil: UserProfile;
}

export interface UpdateUserRequest {
  nomeCompleto: string;
  cpf: string;
  email: string;
  cargo: string;
  login: string;
  senha?: string;
  perfil: UserProfile;
}

export interface UserResponse {
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

export enum UserProfile {
  ADMINISTRADOR = "ADMINISTRADOR",
  GERENTE = "GERENTE",
  COLABORADOR = "COLABORADOR",
}
