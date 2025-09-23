import { UserResponse } from "@/features/users/dtos/User.dto";

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario?: UserResponse;
}

export interface AuthError {
  message: string;
  status: number;
}
