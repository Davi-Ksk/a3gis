import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { TaskResponse } from "../dtos/Task.dto"
import { TaskCard } from "./TaskCard"

interface SortableTaskCardProps {
  task: TaskResponse
  onRefresh: () => void
}

export const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, onRefresh }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} onRefresh={onRefresh} />
    </div>
  )
}
