import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSessionUser, LoginProfiles, LoginResponse } from "@/core/models/auth-login.model";
import { applySessionRoleFromLoginUser, resetPerlappRoleToGuest } from "@/store/perlapp-role.store";

interface AuthState {
  user: AuthSessionUser | null;
  token: string | null;
  refreshToken: string | null;
  /** Epoch ms cuando expira el access_token (aprox.). */
  expiresAt: number | null;
  profiles: LoginProfiles | null;
  isAuthenticated: boolean;
  loginFromApi: (payload: LoginResponse) => void;
  logout: () => void;
}

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      profiles: null,
      isAuthenticated: false,

      loginFromApi: (payload) => {
        setCookie("auth-token", payload.access_token);
        applySessionRoleFromLoginUser(payload.user);
        set({
          user: payload.user,
          token: payload.access_token,
          refreshToken: payload.refresh_token ?? null,
          expiresAt: Date.now() + Math.max(0, payload.expires_in) * 1000,
          profiles: payload.profiles ?? null,
          isAuthenticated: true,
        });
      },

      logout: () => {
        deleteCookie("auth-token");
        resetPerlappRoleToGuest();
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          profiles: null,
          isAuthenticated: false,
        });
      },
    }),
    { name: "auth-storage" }
  )
);
