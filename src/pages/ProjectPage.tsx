"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { ProjectCard } from "../features/projects/components/ProjectCard"
import { ProjectForm } from "../features/projects/components/ProjectForm"
import { useProjects } from "../features/projects/hooks/useProjects"
import { useAuth } from "../providers/AuthProvider"
import { Plus, FolderOpen, Loader2 } from "lucide-react"

export const ProjectPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { projects, isLoading, error, refetch } = useProjects()
  const { isAdmin } = useAuth()

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
        <span className="ml-2">Carregando projetos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie todos os seus projetos</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Todos os Projetos</CardTitle>
          <CardDescription>Lista de todos os projetos cadastrados</CardDescription>
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
              {projects.map((project) => (
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
