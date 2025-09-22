"use client"

import React, { useMemo } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { TaskResponse } from "../dtos/Task.dto"
import { TaskCard } from "./TaskCard"
import { KanbanColumn } from "./KanbanColumn"
import { useTaskActions } from "../hooks/useTaskActions"
import { Clock, Play, CheckCircle, X } from "lucide-react"

interface KanbanBoardProps {
  tasks: TaskResponse[]
  onRefresh: () => void
}

const COLUMNS = [
  {
    id: "PENDENTE",
    title: "Pendente",
    icon: Clock,
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "EM_ANDAMENTO",
    title: "Em Andamento",
    icon: Play,
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "CONCLUIDO",
    title: "Concluído",
    icon: CheckCircle,
    color: "bg-green-50 border-green-200",
  },
  {
    id: "CANCELADO",
    title: "Cancelado",
    icon: X,
    color: "bg-red-50 border-red-200",
  },
]

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onRefresh }) => {
  const [activeTask, setActiveTask] = React.useState<TaskResponse | null>(null)
  const { startTask, completeTask, cancelTask } = useTaskActions()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return COLUMNS.reduce(
      (acc, column) => {
        acc[column.id] = tasks.filter((task) => task.status === column.id)
        return acc
      },
      {} as Record<string, TaskResponse[]>,
    )
  }, [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id.toString() === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = Number(active.id)
    const newStatus = over.id as string
    const task = tasks.find((t) => t.id === taskId)

    if (!task || task.status === newStatus) return

    try {
      // Call appropriate API based on the new status
      switch (newStatus) {
        case "EM_ANDAMENTO":
          await startTask(taskId)
          break
        case "CONCLUIDO":
          await completeTask(taskId)
          break
        case "CANCELADO":
          await cancelTask(taskId)
          break
        default:
          return // Can't move back to PENDENTE via drag
      }

      onRefresh()
    } catch (error) {
      // Error is handled by the hook
      console.error("Error updating task status:", error)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((column) => {
          const columnTasks = tasksByStatus[column.id] || []

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              color={column.color}
              tasks={columnTasks}
              onRefresh={onRefresh}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onRefresh={onRefresh} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
