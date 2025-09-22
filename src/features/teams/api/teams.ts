import api from "../../../lib/axios"
import type { CreateTeamRequest, UpdateTeamRequest, TeamResponse } from "../dtos/Team.dto"

export const getTeams = async (): Promise<TeamResponse[]> => {
  const response = await api.get("/equipes")
  return response.data
}

export const getTeam = async (id: number): Promise<TeamResponse> => {
  const response = await api.get(`/equipes/${id}`)
  return response.data
}

export const createTeam = async (teamData: CreateTeamRequest): Promise<TeamResponse> => {
  const response = await api.post("/equipes", teamData)
  return response.data
}

export const updateTeam = async (id: number, teamData: UpdateTeamRequest): Promise<TeamResponse> => {
  const response = await api.put(`/equipes/${id}`, teamData)
  return response.data
}

export const deleteTeam = async (id: number): Promise<void> => {
  await api.delete(`/equipes/${id}`)
}
