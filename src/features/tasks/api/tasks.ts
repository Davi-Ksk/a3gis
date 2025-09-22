import api from "../../../lib/axios"
import type { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TaskHistoryResponse } from "../dtos/Task.dto"

export const createTask = async (taskData: CreateTaskRequest): Promise<TaskResponse> => {
  const response = await api.post("/tarefas", taskData)
  return response.data
}

export const updateTask = async (id: number, taskData: UpdateTaskRequest): Promise<TaskResponse> => {
  const response = await api.put(`/tarefas/${id}`, taskData)
  return response.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tarefas/${id}`)
}

export const startTask = async (id: number): Promise<void> => {
  await api.post(`/tarefas/${id}/iniciar`)
}

export const completeTask = async (id: number): Promise<void> => {
  await api.post(`/tarefas/${id}/concluir`)
}

export const cancelTask = async (id: number): Promise<void> => {
  await api.post(`/tarefas/${id}/cancelar`)
}

export const getTaskHistory = async (id: number): Promise<TaskHistoryResponse[]> => {
  const response = await api.get(`/tarefas/${id}/historico`)
  return response.data
}
