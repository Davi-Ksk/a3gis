import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProject } from '../api/projects'

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Erro ao deletar projeto:', error)
      // Optionally, add more sophisticated error handling like a toast notification
    },
  })
}
