"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import type { TaskResponse } from "../dtos/Task.dto"
import { Calendar, User, Play, CheckCircle, X } from "lucide-react"
import { useTaskActions } from "../hooks/useTaskActions"

interface TaskCardProps {
  task: TaskResponse
  onRefresh: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onRefresh }) => {
  const { startTask, completeTask, cancelTask, isLoading } = useTaskActions()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800"
      case "EM_ANDAMENTO":
        return "bg-blue-100 text-blue-800"
      case "CONCLUIDO":
        return "bg-green-100 text-green-800"
      case "CANCELADO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      switch (newStatus) {
        case "EM_ANDAMENTO":
          await startTask(task.id)
          break
        case "CONCLUIDO":
          await completeTask(task.id)
          break
        case "CANCELADO":
          await cancelTask(task.id)
          break
      }
      onRefresh()
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const isOverdue =
    new Date(task.dataFimPrevista) < new Date() && (task.status === "PENDENTE" || task.status === "EM_ANDAMENTO")

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue ? "border-red-200" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">{task.titulo}</CardTitle>
          <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{task.descricao}</p>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              {formatDate(task.dataFimPrevista)}
              {isOverdue && " (Atrasado)"}
            </span>
          </div>

          {task.responsavel && (
            <div className="flex items-center">
              <User className="mr-1 h-3 w-3" />
              <span>{task.responsavel.nomeCompleto}</span>
            </div>
          )}
        </div>

        {/* Action buttons based on current status */}
        <div className="flex gap-1 pt-2">
          {task.status === "PENDENTE" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange("EM_ANDAMENTO")}
              disabled={isLoading}
              className="flex-1"
            >
              <Play className="mr-1 h-3 w-3" />
              Iniciar
            </Button>
          )}

          {task.status === "EM_ANDAMENTO" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("CONCLUIDO")}
                disabled={isLoading}
                className="flex-1"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Concluir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("CANCELADO")}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="mr-1 h-3 w-3" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
