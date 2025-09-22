"use client"

import type React from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { LayoutDashboard, FolderOpen, Users, UserCheck } from "lucide-react"

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth()

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      adminOnly: false,
    },
    {
      to: "/projects",
      icon: FolderOpen,
      label: "Projetos",
      adminOnly: false,
    },
    {
      to: "/teams",
      icon: Users,
      label: "Equipes",
      adminOnly: true,
    },
    {
      to: "/users",
      icon: UserCheck,
      label: "Usuários",
      adminOnly: true,
    },
  ]

  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
