"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search, ShoppingCart } from "lucide-react";
import { cartItemCount } from "@/lib/cart.utils";
import type { PerlappRole } from "@/types/perlapp-role.types";
import { getProfileHrefForRole } from "@/store/perlapp-role.store";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

const navLink =
  "font-display font-semibold text-base rounded-lg px-perlapp-sm py-perlapp-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800";

const ROLE_LABELS: Record<PerlappRole, string> = {
  invitado: "Invitado",
  comprador: "Comprador",
  market: "Comercio",
};

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  const single = parts[0] ?? "?";
  return single.slice(0, 2).toUpperCase();
}

type PerlappHomeHeaderProps = {
  /** Barra de navegación desktop (Home, Explore, …). */
  showDesktopNav?: boolean;
  /** Cabecera fija (home) o pegajosa (perfil comercio). */
  position?: "fixed" | "sticky";
};

export function PerlappHomeHeader({
  showDesktopNav = true,
  position = "fixed",
}: PerlappHomeHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const profileHref = getProfileHrefForRole(role);
  const itemCount = useCartStore((s) => cartItemCount(s.items));
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const requests = useMarketConnectionsStore((s) => s.requests);
  const pendingIncoming =
    role === "market" && activeMarketId
      ? requests.filter(
          (r) => r.toMerchantId === activeMarketId && r.status === "pendiente"
        ).length
      : 0;

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push("/");
  };

  const positionClass =
    position === "sticky"
      ? "sticky top-0 z-40"
      : "fixed top-0 left-0 right-0 z-40";

  return (
    <header
      className={`${positionClass} border-b border-perlapp-divider bg-perlapp-header shadow-perlapp-float dark:border-slate-800 dark:bg-slate-950`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-perlapp-xs">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight text-perlapp-orange"
          >
            Perlapp
          </Link>
        </div>

        <nav
          className={`hidden items-center gap-perlapp-md md:flex ${showDesktopNav ? "" : "md:hidden"}`}
          aria-label="Principal"
        >
          <Link href="/" className={`${navLink} font-bold text-perlapp-orange`}>
            Inicio
          </Link>
          <Link
            href="/explorar"
            className={`${navLink} text-perlapp-teal dark:text-slate-400`}
          >
            Explorar
          </Link>
          {isAuthenticated ? (
            <Link
              href={profileHref}
              className={`${navLink} text-perlapp-teal dark:text-slate-400`}
            >
              Perfil
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-perlapp-sm">
          <Link
            href="/notifications"
            className="relative hidden rounded-full p-perlapp-xs text-perlapp-orange transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:inline-flex"
            aria-label={
              pendingIncoming > 0
                ? `Notificaciones, ${pendingIncoming} solicitud${pendingIncoming === 1 ? "" : "es"} pendiente${pendingIncoming === 1 ? "" : "s"}`
                : "Notificaciones"
            }
          >
            <Bell className="h-6 w-6" strokeWidth={2} />
            {pendingIncoming > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-perlapp-orange px-0.5 font-display text-[9px] font-bold leading-none text-white">
                {pendingIncoming > 9 ? "9+" : pendingIncoming}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label="Buscar"
            className="rounded-full p-perlapp-xs text-perlapp-orange transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="h-6 w-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label={itemCount > 0 ? `Carrito, ${itemCount} artículos` : "Carrito"}
            onClick={toggleDrawer}
            className="relative rounded-full p-perlapp-xs text-perlapp-orange transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={2} />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-perlapp-orange px-1 font-display text-[10px] font-bold leading-none text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </button>

          {isAuthenticated && user ? (
            <div className="relative flex shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-perlapp-orange text-sm font-bold text-white shadow-sm ring-2 ring-transparent transition hover:bg-perlapp-orange/90 focus-visible:outline-none focus-visible:ring-perlapp-orange/40"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label="Menú de cuenta"
              >
                <span className="font-display tracking-tight">{userInitials(user.name)}</span>
              </button>
              {menuOpen ? (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-[min(17rem,calc(100vw-2rem))] rounded-xl border border-perlapp-line/60 bg-perlapp-white py-2 shadow-xl"
                  role="menu"
                  aria-label="Cuenta"
                >
                  <div className="border-b border-perlapp-line/40 px-4 py-3">
                    <p className="truncate font-display text-sm font-semibold text-perlapp-ink">{user.name}</p>
                    <p className="mt-0.5 font-display text-xs text-perlapp-inkMuted">{ROLE_LABELS[role]}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-display text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
                    Cerrar sesión
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="shrink-0 rounded-full border border-perlapp-orange/40 bg-perlapp-orange/10 px-3 py-1.5 font-display text-xs font-semibold text-perlapp-orange transition hover:bg-perlapp-orange/15 md:text-sm"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
