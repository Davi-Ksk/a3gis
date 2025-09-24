"use client"

import { useQuery } from "@tanstack/react-query"
import { getProjectTasks } from "../api/projects"
import type { Task } from "../../../types/global"

export const useProjectTasks = (projectId: number) => {
  const { data, isLoading, error, refetch } = useQuery<Task[], Error>({
    queryKey: ["project-tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId, // Only run the query if projectId is available
  })

  return {
    tasks: data || [],
    isLoading,
    error: error ? error.message : null,
    refetch,
  }
}
