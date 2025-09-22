"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { useLogin } from "../hooks/useLogin"
import { LogIn, Loader2 } from "lucide-react"

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
  })

  const { handleLogin, isLoading, error, clearError } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await handleLogin(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">A3GIS</h1>
          <p className="mt-2 text-sm text-gray-600">Project Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Fazer Login</CardTitle>
            <CardDescription className="text-center">Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="login" className="text-sm font-medium text-gray-700">
                  Login
                </label>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Digite seu login"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
