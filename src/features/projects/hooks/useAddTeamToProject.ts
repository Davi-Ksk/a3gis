import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTeamToProject } from '../api/projects'

export const useAddTeamToProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, teamId }: { projectId: number; teamId: number }) =>
      addTeamToProject(projectId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
    onError: (error) => {
      console.error('Erro ao adicionar equipe ao projeto:', error)
      // Optionally, add more sophisticated error handling like a toast notification
    },
  })
}
