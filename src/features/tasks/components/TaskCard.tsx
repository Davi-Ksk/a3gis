"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type { TaskResponse } from "../dtos/Task.dto";
import { StatusTarefa } from "../dtos/Task.dto";
import { Calendar, User, Play, CheckCircle, X, Trash2, Edit } from "lucide-react";
import { useTaskActions } from "../hooks/useTaskActions";
import { TaskForm } from "./TaskForm";

interface TaskCardProps {
  task: TaskResponse;
  onRefresh: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onRefresh }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const {
    startTask,
    completeTask,
    cancelTask,
    reopenTask,
    deleteTask,
    isLoading,
  } = useTaskActions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: StatusTarefa) => {
    switch (status) {
      case StatusTarefa.PENDENTE:
        return "bg-yellow-100 text-yellow-800";
      case StatusTarefa.EM_ANDAMENTO:
        return "bg-blue-100 text-blue-800";
      case StatusTarefa.CONCLUIDA:
        return "bg-green-100 text-green-800";
      case StatusTarefa.CANCELADA:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (newStatus: StatusTarefa) => {
    try {
      switch (newStatus) {
        case StatusTarefa.EM_ANDAMENTO:
          await startTask(task.id);
          break;
        case StatusTarefa.CONCLUIDA:
          await completeTask(task.id);
          break;
        case StatusTarefa.CANCELADA:
          await cancelTask(task.id);
          break;
        case StatusTarefa.PENDENTE: // Reabrir
          await reopenTask(task.id);
          break;
      }
      onRefresh();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await deleteTask(task.id);
        onRefresh();
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
      }
    }
  };

  const isOverdue =
    new Date(task.dataFimPrevista) < new Date() &&
    (task.status === "PENDENTE" || task.status === "EM_ANDAMENTO");

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        isOverdue ? "border-red-200" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">{task.titulo}</CardTitle>
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace("_", " ")}
          </Badge>
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
          {task.status === StatusTarefa.PENDENTE && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(StatusTarefa.EM_ANDAMENTO)}
              disabled={isLoading}
              className="flex-1"
            >
              <Play className="mr-1 h-3 w-3" />
              Iniciar
            </Button>
          )}

          {task.status === StatusTarefa.EM_ANDAMENTO && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange(StatusTarefa.CONCLUIDA)}
                disabled={isLoading}
                className="flex-1"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Concluir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange(StatusTarefa.CANCELADA)}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="mr-1 h-3 w-3" />
                Cancelar
              </Button>
            </>
          )}

          {(task.status === StatusTarefa.CONCLUIDA ||
            task.status === StatusTarefa.CANCELADA) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(StatusTarefa.PENDENTE)}
              disabled={isLoading}
              className="flex-1"
            >
              <Play className="mr-1 h-3 w-3" />
              Reabrir
            </Button>
          )}
        </div>
        <div className="flex gap-1 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            disabled={isLoading}
            className="flex-1"
          >
            <Edit className="mr-1 h-3 w-3" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Excluir
          </Button>
        </div>
      </CardContent>
      <TaskForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onRefresh}
        task={task}
      />
    </Card>
  );
};
