"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from "../dtos/Task.dto";
import { useTaskActions } from "../hooks/useTaskActions";
import { useCreateTask } from "../hooks/useCreateTask"; // Import the new hook
import { useUsers } from "../../users/hooks/useUsers";
import { useProjects } from "../../projects/hooks/useProjects";
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: number;
  task?: TaskResponse; // Added for editing
  allowedUserIds?: number[]; // New prop for filtering users
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  task, // Destructure task prop
  allowedUserIds, // Destructure new prop
}) => {
  const [formData, setFormData] = useState({
    titulo: task?.titulo || "",
    descricao: task?.descricao || "",
    dataFimPrevista: task?.dataFimPrevista.split("T")[0] || "", // Format date for input
    projetoId: task?.projetoId.toString() || projectId?.toString() || "",
    responsavelId: task?.responsavelId?.toString() || "",
  });

  const { updateTask, isLoading: isUpdating, error: updateError } = useTaskActions();
  const { mutate: createTaskMutation, isPending: isCreating, error: createError } = useCreateTask(projectId || 0); // Pass projectId
  const { users } = useUsers();
  const { projects } = useProjects();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        titulo: task.titulo,
        descricao: task.descricao,
        dataFimPrevista: task.dataFimPrevista.split("T")[0],
        projetoId: task.projetoId.toString(),
        responsavelId: task.responsavelId?.toString() || "",
      });
    } else if (!isOpen) {
      setFormData({
        titulo: "",
        descricao: "",
        dataFimPrevista: "",
        projetoId: projectId?.toString() || "",
        responsavelId: "",
      });
    }
  }, [isOpen, projectId, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        projetoId: Number.parseInt(formData.projetoId),
        responsavelId: formData.responsavelId
          ? Number.parseInt(formData.responsavelId)
          : undefined,
      };

      if (task) {
        // Editing existing task
        await updateTask(task.id, payload as UpdateTaskRequest);
      } else {
        // Creating new task
        await createTaskMutation(payload as CreateTaskRequest);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Editar Tarefa" : "Criar Nova Tarefa"}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Edite as informações da tarefa."
              : "Preencha as informações para criar uma nova tarefa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.toString()}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="titulo" className="text-sm font-medium">
              Título da Tarefa
            </label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
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
              <label htmlFor="dataFimPrevista" className="text-sm font-medium">
                Data Prevista de Fim
              </label>
              <Input
                id="dataFimPrevista"
                name="dataFimPrevista"
                type="date"
                value={formData.dataFimPrevista}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="responsavelId" className="text-sm font-medium">
                Responsável
              </label>
              <Select
                value={formData.responsavelId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, responsavelId: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(user => !allowedUserIds || allowedUserIds.includes(user.id))
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.nomeCompleto}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!projectId && (
            <div className="space-y-2">
              <label htmlFor="projetoId" className="text-sm font-medium">
                Projeto
              </label>
              <Select
                value={formData.projetoId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, projetoId: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {task ? "Salvando..." : "Criando..."}
                </>
              ) : task ? (
                "Salvar Alterações"
              ) : (
                "Criar Tarefa"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};