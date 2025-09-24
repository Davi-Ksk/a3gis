"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../components/ui/dropdown-menu";
import { StatusProjeto, type ProjectResponse } from "../dtos/Project.dto";
import {
  Calendar,
  User,
  Eye,
  MoreVertical,
  Play,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  Users,
} from "lucide-react";
import { useAuth } from "../../../providers/AuthProvider";
import { useStartProject } from "../hooks/useStartProject";
import { useCompleteProject } from "../hooks/useCompleteProject";
import { useCancelProject } from "../hooks/useCancelProject";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { getProjectStatusDisplay } from "../../../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { AddTeamToProjectModal } from "./AddTeamToProjectModal";

interface ProjectCardProps {
  project: ProjectResponse;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

  const { mutate: startProjectMutation, isPending: isStarting } =
    useStartProject();
  const { mutate: completeProjectMutation, isPending: isCompleting } =
    useCompleteProject();
  const { mutate: cancelProjectMutation, isPending: isCancelling } =
    useCancelProject();
  const { mutate: deleteProjectMutation, isPending: isDeleting } =
    useDeleteProject();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleStartProject = () => {
    startProjectMutation(project.id);
  };

  const handleCompleteProject = () => {
    completeProjectMutation(project.id);
  };

  const handleCancelProject = () => {
    cancelProjectMutation(project.id);
  };

  const handleDeleteProject = () => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      deleteProjectMutation(project.id);
    }
  };

  const handleAddTeamSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setIsAddTeamModalOpen(false);
  };

  const statusDisplay = project.status
    ? getProjectStatusDisplay(project.status)
    : { text: "Desconhecido", color: "bg-gray-100 text-gray-800" };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.nome}</CardTitle>
            <CardDescription className="mt-1">
              {project.descricao}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {project.status && (
              <Badge className={statusDisplay.color}>
                {statusDisplay.text}
              </Badge>
            )}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(project.status === StatusProjeto.PLANEJADO ||
                    project.status === StatusProjeto.CANCELADO) && (
                    <DropdownMenuItem
                      onClick={handleStartProject}
                      disabled={isStarting}
                    >
                      {isStarting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      Iniciar Projeto
                    </DropdownMenuItem>
                  )}
                  {project.status === StatusProjeto.EM_ANDAMENTO && (
                    <DropdownMenuItem
                      onClick={handleCompleteProject}
                      disabled={isCompleting}
                    >
                      {isCompleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Concluir Projeto
                    </DropdownMenuItem>
                  )}
                  {project.status !== StatusProjeto.CANCELADO &&
                    project.status !== StatusProjeto.CONCLUIDO && (
                      <DropdownMenuItem
                        onClick={handleCancelProject}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Cancelar Projeto
                      </DropdownMenuItem>
                    )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsAddTeamModalOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Adicionar Equipe
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteProject}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Deletar Projeto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {formatDate(project.dataInicio)} -{" "}
              {formatDate(project.dataPrevFim)}
            </span>
          </div>

          {project.responsavel && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="mr-2 h-4 w-4" />
              <span>{project.responsavel.nomeCompleto}</span>
            </div>
          )}

          {project.equipes && project.equipes?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-700">
                Equipes:
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="mr-2 h-4 w-4" />
                {project.equipes?.map((team) => (
                  <span className="mr-2" key={team.id}>
                    {team.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/project/${project.id}`)}
              className="w-full"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
      <AddTeamToProjectModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onSuccess={handleAddTeamSuccess}
        projectId={project.id}
      />
    </Card>
  );
};
