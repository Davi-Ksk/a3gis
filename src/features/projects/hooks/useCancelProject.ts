import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelProject } from '../api/projects'

export const useCancelProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Erro ao cancelar projeto:', error)
      // Optionally, add more sophisticated error handling like a toast notification
    },
  })
}
