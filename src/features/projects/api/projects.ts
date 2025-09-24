import api from "../../../lib/axios"
import type { CreateProjectRequest, UpdateProjectRequest, ProjectResponse } from "../dtos/Project.dto"
import type { Task } from "../../../types/global"

export const getProjects = async (): Promise<ProjectResponse[]> => {
  const response = await api.get("/projetos")
  return response.data
}

export const getProject = async (id: number): Promise<ProjectResponse> => {
  const response = await api.get(`/projetos/${id}`)
  return response.data
}

export const getProjectTasks = async (id: number): Promise<Task[]> => {
  const response = await api.get(`/projetos/${id}/tarefas`)
  return response.data
}

export const createProject = async (projectData: CreateProjectRequest): Promise<ProjectResponse> => {
  const response = await api.post("/projetos", projectData)
  return response.data
}

export const updateProject = async (id: number, projectData: UpdateProjectRequest): Promise<ProjectResponse> => {
  const response = await api.put(`/projetos/${id}`, projectData)
  return response.data
}

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projetos/${id}`)
}

export const addTeamToProject = async (projectId: number, teamId: number): Promise<void> => {
  await api.post(`/projetos/${projectId}/equipes/${teamId}`)
}

export const startProject = async (id: number): Promise<void> => {
  await api.post(`/projetos/${id}/iniciar`)
}

export const completeProject = async (id: number): Promise<void> => {
  await api.post(`/projetos/${id}/concluir`)
}

export const cancelProject = async (id: number): Promise<void> => {
  await api.post(`/projetos/${id}/cancelar`)
}
