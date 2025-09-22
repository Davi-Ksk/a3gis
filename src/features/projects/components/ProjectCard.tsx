"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import type { ProjectResponse } from "../dtos/Project.dto"
import { Calendar, User, Eye } from "lucide-react"

interface ProjectCardProps {
  project: ProjectResponse
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate()

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.nome}</CardTitle>
            <CardDescription className="mt-1">{project.descricao}</CardDescription>
          </div>
          {project.status && <Badge className={getStatusColor(project.status)}>{project.status}</Badge>}
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
