import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startProject } from '../api/projects'

export const useStartProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Erro ao iniciar projeto:', error)
      // Optionally, add more sophisticated error handling like a toast notification
    },
  })
}
