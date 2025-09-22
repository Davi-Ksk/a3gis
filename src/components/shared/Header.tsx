"use client"

import type React from "react"
import { useAuth } from "../../providers/AuthProvider"
import { Button } from "../ui/button"
import { LogOut, User } from "lucide-react"

export const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">A3GIS</h1>
          <span className="text-sm text-gray-500">Project Manager</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{user?.nomeCompleto}</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{user?.perfil}</span>
          </div>

          <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
