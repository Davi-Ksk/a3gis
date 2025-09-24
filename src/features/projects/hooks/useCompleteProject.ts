import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeProject } from '../api/projects'

export const useCompleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: completeProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Erro ao concluir projeto:', error)
      // Optionally, add more sophisticated error handling like a toast notification
    },
  })
}
