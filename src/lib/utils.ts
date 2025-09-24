import { UserProfile } from "@/features/users/dtos/User.dto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StatusProjeto } from "../features/projects/dtos/Project.dto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function userProfileToString(profile?: UserProfile): string {
  switch (profile) {
    case UserProfile.ADMINISTRADOR:
      return "Administrador";
    case UserProfile.GERENTE:
      return "Gerente";
    case UserProfile.COLABORADOR:
      return "Colaborador";
    default:
      return "Desconhecido";
  }
}

export function getProjectStatusDisplay(status: StatusProjeto) {
  switch (status) {
    case StatusProjeto.PLANEJADO:
      return { text: "Planejado", color: "bg-gray-100 text-gray-800" };
    case StatusProjeto.EM_ANDAMENTO:
      return { text: "Em Andamento", color: "bg-blue-100 text-blue-800" };
    case StatusProjeto.CONCLUIDO:
      return { text: "Concluído", color: "bg-green-100 text-green-800" };
    case StatusProjeto.CANCELADO:
      return { text: "Cancelado", color: "bg-red-100 text-red-800" };
    default:
      return { text: "Desconhecido", color: "bg-gray-100 text-gray-800" };
  }
}
