import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/http.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
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
      isAuthenticated: false,

      login: (user, token) => {
        setCookie("auth-token", token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        deleteCookie("auth-token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "auth-storage" }
  )
);
