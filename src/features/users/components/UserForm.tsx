"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
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
import type { CreateUserRequest, UpdateUserRequest, UserResponse } from "../dtos/User.dto"
import { useCreateUser } from "../hooks/useCreateUser"
import { useUpdateUser } from "../hooks/useUpdateUser"
import { Loader2 } from "lucide-react"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  user?: UserResponse | null
}

export const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    cargo: "",
    login: "",
    senha: "",
    perfil: "USUARIO" as "ADMINISTRADOR" | "USUARIO",
  })

  const { createUser, isLoading: isCreating, error: createError } = useCreateUser()
  const { updateUser, isLoading: isUpdating, error: updateError } = useUpdateUser()

  const isEditing = !!user
  const isLoading = isCreating || isUpdating
  const error = createError || updateError

  useEffect(() => {
    if (user) {
      setFormData({
        nomeCompleto: user.nomeCompleto,
        cpf: user.cpf,
        email: user.email,
        cargo: user.cargo,
        login: user.login,
        senha: "",
        perfil: user.perfil,
      })
    } else {
      setFormData({
        nomeCompleto: "",
        cpf: "",
        email: "",
        cargo: "",
        login: "",
        senha: "",
        perfil: "USUARIO",
      })
    }
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && user) {
        const updateData: UpdateUserRequest = { ...formData }
        if (!updateData.senha) {
          delete updateData.senha
        }
        await updateUser(user.id, updateData)
      } else {
        await createUser(formData as CreateUserRequest)
      }
      onSuccess()
      onClose()
    } catch (error) {
      // Error is handled by the hooks
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do usuário abaixo."
              : "Preencha as informações para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nomeCompleto" className="text-sm font-medium">
                Nome Completo
              </label>
              <Input
                id="nomeCompleto"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cargo" className="text-sm font-medium">
                Cargo
              </label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login" className="text-sm font-medium">
                Login
              </label>
              <Input
                id="login"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="senha" className="text-sm font-medium">
                {isEditing ? "Nova Senha (opcional)" : "Senha"}
              </label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                required={!isEditing}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="perfil" className="text-sm font-medium">
                Perfil
              </label>
              <Select
                value={formData.perfil}
                onValueChange={(value: "ADMINISTRADOR" | "USUARIO") =>
                  setFormData((prev) => ({ ...prev, perfil: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USUARIO">Usuário</SelectItem>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : isEditing ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
