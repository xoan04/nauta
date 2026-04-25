import { create } from "zustand";
import { persist } from "zustand/middleware";
import { merchantProfilePath } from "@/lib/merchant-profile.mock";
import type { PerlappRole } from "@/types/perlapp-role.types";

type PerlappRoleState = {
  role: PerlappRole;
  /** Comercio activo para acciones del rol market. */
  activeMarketId: string;
  setRole: (role: PerlappRole) => void;
  setActiveMarketId: (marketId: string) => void;
};

export const usePerlappRoleStore = create<PerlappRoleState>()(
  persist(
    (set) => ({
      role: "invitado",
      activeMarketId: "1",
      setRole: (role) => set({ role }),
      setActiveMarketId: (activeMarketId) => set({ activeMarketId }),
    }),
    { name: "perlapp-role" }
  )
);

export function getProfileHrefForRole(role: PerlappRole): string {
  if (role === "comprador") return "/perfil";
  if (role === "market") return merchantProfilePath("me");
  return "/perfil";
}
