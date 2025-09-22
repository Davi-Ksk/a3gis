"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import type { CreateProjectRequest } from "../dtos/Project.dto"
import { useCreateProject } from "../hooks/useCreateProject"
import { useUsers } from "../../users/hooks/useUsers"
import { Loader2 } from "lucide-react"

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataPrevFim: "",
    responsavelId: "",
  })

  const { createProject, isLoading, error } = useCreateProject()
  const { users } = useUsers()

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nome: "",
        descricao: "",
        dataInicio: "",
        dataPrevFim: "",
        responsavelId: "",
      })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const projectData: CreateProjectRequest = {
        ...formData,
        responsavelId: Number.parseInt(formData.responsavelId),
      }

      await createProject(projectData)
      onSuccess()
      onClose()
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>Preencha as informações para criar um novo projeto.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome do Projeto
            </label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dataInicio" className="text-sm font-medium">
                Data de Início
              </label>
              <Input
                id="dataInicio"
                name="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dataPrevFim" className="text-sm font-medium">
                Data Prevista de Fim
              </label>
              <Input
                id="dataPrevFim"
                name="dataPrevFim"
                type="date"
                value={formData.dataPrevFim}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="responsavelId" className="text-sm font-medium">
              Responsável
            </label>
            <Select
              value={formData.responsavelId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, responsavelId: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.nomeCompleto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
