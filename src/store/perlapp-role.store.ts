import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSessionUser } from "@/core/models/auth-login.model";
import { mapApiRoleToPerlappRole } from "@/lib/api-role-map";
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

/** Tras login: rol de UI + id de comercio activo (= id de usuario merchant en el API). */
export function applySessionRoleFromLoginUser(user: AuthSessionUser): void {
  const role = mapApiRoleToPerlappRole(user.role);
  usePerlappRoleStore.setState({
    role,
    activeMarketId: role === "market" ? user.id : "1",
  });
}

export function syncPerlappRoleFromAuthUser(user: AuthSessionUser | null): void {
  if (!user) {
    resetPerlappRoleToGuest();
    return;
  }
  applySessionRoleFromLoginUser(user);
}

export function resetPerlappRoleToGuest(): void {
  usePerlappRoleStore.setState({ role: "invitado", activeMarketId: "1" });
}
