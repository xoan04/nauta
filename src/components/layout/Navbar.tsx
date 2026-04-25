"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { LogOut, Menu } from "lucide-react";
import { useUiStore } from "@/store/ui.store";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  return (
    <header className="flex h-14 items-center border-b border-border bg-background px-4">
      <div className="flex w-full max-w-6xl mx-auto items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="font-semibold tracking-tight truncate">
            {APP_NAME}
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 min-w-0">
          {user && (
            <span className="text-sm text-muted-foreground truncate max-w-[8rem] sm:max-w-[14rem]" title={user.email}>
              {user.name}
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
