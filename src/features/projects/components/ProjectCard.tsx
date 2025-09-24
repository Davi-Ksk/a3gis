"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../../components/ui/dropdown-menu"
import type { ProjectResponse } from "../dtos/Project.dto"
import { Calendar, User, Eye, MoreVertical, Play, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "../../../providers/AuthProvider"
import { useStartProject } from "../hooks/useStartProject"
import { useCompleteProject } from "../hooks/useCompleteProject"
import { useCancelProject } from "../hooks/useCancelProject"
import { useQueryClient } from "@tanstack/react-query"

interface ProjectCardProps {
  project: ProjectResponse
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()

  const { mutate: startProjectMutation, isPending: isStarting } = useStartProject()
  const { mutate: completeProjectMutation, isPending: isCompleting } = useCompleteProject()
  const { mutate: cancelProjectMutation, isPending: isCancelling } = useCancelProject()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ATIVO":
        return "bg-green-100 text-green-800"
      case "CONCLUIDO":
        return "bg-blue-100 text-blue-800"
      case "CANCELADO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStartProject = () => {
    startProjectMutation(project.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
      },
    })
  }

  const handleCompleteProject = () => {
    completeProjectMutation(project.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
      },
    })
  }

  const handleCancelProject = () => {
    cancelProjectMutation(project.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
      },
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.nome}</CardTitle>
            <CardDescription className="mt-1">{project.descricao}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {project.status && <Badge className={getStatusColor(project.status)}>{project.status}</Badge>}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {project.status !== "ATIVO" && project.status !== "CONCLUIDO" && (
                    <DropdownMenuItem onClick={handleStartProject} disabled={isStarting}>
                      {isStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Iniciar Projeto
                    </DropdownMenuItem>
                  )}
                  {project.status === "ATIVO" && (
                    <>
                      <DropdownMenuItem onClick={handleCompleteProject} disabled={isCompleting}>
                        {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Concluir Projeto
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleCancelProject} disabled={isCancelling}>
                        {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                        Cancelar Projeto
                      </DropdownMenuItem>
                    </>
                  )}
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
              {formatDate(project.dataInicio)} - {formatDate(project.dataPrevFim)}
            </span>
          </div>

          {project.responsavel && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="mr-2 h-4 w-4" />
              <span>{project.responsavel.nomeCompleto}</span>
            </div>
          )}

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/project/${project.id}`)} className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
