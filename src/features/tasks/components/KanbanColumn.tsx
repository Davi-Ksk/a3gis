import type React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import type { TaskResponse } from "../dtos/Task.dto"
import { SortableTaskCard } from "./SortableTaskCard"
import type { LucideIcon } from "lucide-react"

interface KanbanColumnProps {
  id: string
  title: string
  icon: LucideIcon
  color: string
  tasks: TaskResponse[]
  onRefresh: () => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, icon: Icon, color, tasks, onRefresh }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <Card className={`${color} ${isOver ? "ring-2 ring-blue-400" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            {title}
          </div>
          <Badge variant="secondary">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
          <SortableContext items={tasks.map((task) => task.id.toString())} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} onRefresh={onRefresh} />
            ))}
          </SortableContext>

          {tasks.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">Nenhuma tarefa</div>}
        </div>
      </CardContent>
    </Card>
  )
}
