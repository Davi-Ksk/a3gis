"use client";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useProject } from "../features/projects/hooks/useProject";
import { useProjectTasks } from "../features/projects/hooks/useProjectTasks";
import { useProjectActions } from "../features/projects/hooks/useProjectActions"; // New import
import { KanbanBoard } from "../features/tasks/components/KanbanBoard";
import { TaskForm } from "../features/tasks/components/TaskForm";
import {
  Calendar,
  User,
  Loader2,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Play,
  X,
} from "lucide-react";
import { StatusTarefa } from "../features/tasks/dtos/Task.dto";
import { ProjectResponse } from "../features/projects/dtos/Project.dto"; // New import for ProjectResponse

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const id = Number.parseInt(projectId || "0");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(id);
  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useProjectTasks(id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ATIVO":
        return "bg-green-100 text-green-800";
      case "CONCLUIDO":
        return "bg-blue-100 text-blue-800";
      case "CANCELADO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: StatusTarefa) => {
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

  // Calculate task statistics
  // Calculate task statistics
  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(
      (t) => t.status === StatusTarefa.PENDENTE
    ).length;
    const inProgress = tasks.filter(
      (t) => t.status === StatusTarefa.EM_ANDAMENTO
    ).length;
    const completed = tasks.filter(
      (t) => t.status === StatusTarefa.CONCLUIDA
    ).length;
    const cancelled = tasks.filter(
      (t) => t.status === StatusTarefa.CANCELADA
    ).length;

    const totalForProgress = total - cancelled;
    const progress =
      totalForProgress > 0
        ? Math.round((completed / totalForProgress) * 100)
        : 0;

    return { total, pending, inProgress, completed, cancelled, progress };
  }, [tasks]);

  const handleCreateTask = () => {
    setIsTaskFormOpen(true);
  };

  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
  };

  const handleTaskFormSuccess = () => {
    refetchTasks();
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando projeto...</span>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {projectError || "Projeto não encontrado"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">{project.nome}</h1>
            {project.status && (
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-2">{project.descricao}</p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Início: {formatDate(project.dataInicio)}</div>
              <div>Fim: {formatDate(project.dataPrevFim)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Responsável e Equipes
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex items-center mb-2">
                <User className="mr-2 h-4 w-4" />
                <span>
                  {project.responsavel?.nomeCompleto || "Não definido"}
                </span>
              </div>
              {project.equipes && project.equipes.length > 0 && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs font-medium text-gray-500">
                    Equipes:
                  </div>
                  {project.equipes.map((equipe) => (
                    <div
                      key={equipe.id}
                      className="flex items-center text-xs text-gray-600"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{equipe.nome}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.progress}%</div>
            <div className="text-xs text-muted-foreground">
              {taskStats.completed} de {taskStats.total} tarefas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas (Kanban)</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Em Andamento
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.inProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Concluídas
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.completed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Canceladas
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.cancelled}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {tasksError && (
            <Alert variant="destructive">
              <AlertDescription>{tasksError}</AlertDescription>
            </Alert>
          )}

          {tasksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando tarefas...</span>
            </div>
          ) : (
            <KanbanBoard tasks={tasks} onRefresh={refetchTasks} />
          )}
        </TabsContent>
      </Tabs>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleTaskFormClose}
        onSuccess={handleTaskFormSuccess}
        projectId={id}
        allowedUserIds={
          project.equipes
            ?.flatMap((equipe) => equipe.membros?.map((member) => member.id))
            .filter((id): id is number => typeof id === "number") || []
        }
      />
    </div>
  );
};
