"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { syncPerlappRoleFromAuthUser } from "@/store/perlapp-role.store";

/**
 * Tras hidratar la sesión, alinea el rol de Perlapp con el usuario del API.
 */
export function AuthPerlappRoleSync() {
  useEffect(() => {
    const run = () => {
      const { user, isAuthenticated } = useAuthStore.getState();
      syncPerlappRoleFromAuthUser(isAuthenticated && user ? user : null);
    };

    if (useAuthStore.persist.hasHydrated()) {
      run();
    }

    return useAuthStore.persist.onFinishHydration(() => {
      run();
    });
  }, []);

  return null;
}
