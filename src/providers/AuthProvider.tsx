"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types/global"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("currentUser")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
  }

  const isAuthenticated = !!token && !!user
  const isAdmin = user?.perfil === "ADMINISTRADOR"

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
