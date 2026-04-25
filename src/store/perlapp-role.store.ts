import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PerlappRole } from "@/types/perlapp-role.types";

type PerlappRoleState = {
  role: PerlappRole;
  setRole: (role: PerlappRole) => void;
};

export const usePerlappRoleStore = create<PerlappRoleState>()(
  persist(
    (set) => ({
      role: "invitado",
      setRole: (role) => set({ role }),
    }),
    { name: "perlapp-role" }
  )
);

export function getProfileHrefForRole(role: PerlappRole): string {
  if (role === "comprador") return "/perfil";
  if (role === "market") return "/merchant/me";
  return "/perfil";
}
