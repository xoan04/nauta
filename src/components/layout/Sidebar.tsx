"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Ajustes", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden />}
      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-56 border-r border-border bg-card transition-transform duration-200 md:translate-x-0 md:static md:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          <span className="text-sm font-medium text-muted-foreground">Navegación</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
