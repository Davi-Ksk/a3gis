"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import { loginUser } from "../api/login";
import type { LoginRequest } from "../dtos/Auth.dto";
import { UserResponse, UserProfile } from "@/features/users/dtos/User.dto";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser(credentials);

      // Create user object from response
      const user = {
        id: response.usuario?.id || 0,
        nomeCompleto: response.usuario?.nomeCompleto || "",
        cpf: response.usuario?.cpf || "",
        email: response.usuario?.email || "",
        cargo: response.usuario?.cargo || "",
        login: response.usuario?.login || "",
        perfil: response.usuario?.perfil ?? UserProfile.COLABORADOR,
      } as UserResponse;

      login(response.token, user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
