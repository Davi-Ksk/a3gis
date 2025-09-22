"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { ProjectCard } from "../features/projects/components/ProjectCard"
import { ProjectForm } from "../features/projects/components/ProjectForm"
import { useProjects } from "../features/projects/hooks/useProjects"
import { useAuth } from "../providers/AuthProvider"
import { Plus, FolderOpen, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react"

export const DashboardPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { projects, isLoading, error, refetch } = useProjects()
  const { isAdmin } = useAuth()

  // Calculate project statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length
    const activeProjects = projects.filter((p) => p.status === "ATIVO" || !p.status).length
    const completedProjects = projects.filter((p) => p.status === "CONCLUIDO").length

    // For overdue projects, check if current date is past dataPrevFim
    const now = new Date()
    const overdueProjects = projects.filter((p) => {
      const endDate = new Date(p.dataPrevFim)
      return endDate < now && (p.status === "ATIVO" || !p.status)
    }).length

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
    }
  }, [projects])

  const handleCreateProject = () => {
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleFormSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral dos seus projetos</p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">Todos os projetos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">Finalizados com sucesso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Atrasados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueProjects}</div>
            <p className="text-xs text-muted-foreground">Passaram do prazo</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
          <CardDescription>Lista dos projetos mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando um novo projeto.</p>
              {isAdmin && (
                <div className="mt-6">
                  <Button onClick={handleCreateProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Projeto
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectForm isOpen={isFormOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} />
    </div>
  )
}
