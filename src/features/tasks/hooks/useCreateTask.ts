import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../api/tasks'

export const useCreateTask = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] }) // Invalidate projects to update task counts
    },
    onError: (error) => {
      console.error('Erro ao criar tarefa:', error)
      // Optionally, add more sophisticated error handling like a toast notification
    },
  })
}
