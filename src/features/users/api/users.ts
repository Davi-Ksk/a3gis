import api from "../../../lib/axios";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "../dtos/User.dto";

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const getUser = async (id: number): Promise<UserResponse> => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const createUser = async (
  userData: CreateUserRequest
): Promise<UserResponse> => {
  const response = await api.post("/usuarios", userData);
  return response.data;
};

export const updateUser = async (
  id: number,
  userData: UpdateUserRequest
): Promise<UserResponse> => {
  const response = await api.put(`/usuarios/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};
