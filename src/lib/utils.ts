import { UserProfile } from "@/features/users/dtos/User.dto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
