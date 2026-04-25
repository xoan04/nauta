"use client";

import Link from "next/link";
import { Bell, Search, ShoppingCart } from "lucide-react";
import { PerlappRoleSwitcher } from "@/components/perlapp/PerlappRoleSwitcher";
import { cartItemCount } from "@/lib/cart.utils";
import { getProfileHrefForRole } from "@/store/perlapp-role.store";
import { useCartStore } from "@/store/cart.store";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

const navLink =
  "font-display font-semibold text-base rounded-lg px-perlapp-sm py-perlapp-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800";

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
          <Link
            href={profileHref}
            className={`${navLink} text-perlapp-teal dark:text-slate-400`}
          >
            Perfil
          </Link>
        </nav>

        <div className="flex items-center gap-perlapp-sm">
          <PerlappRoleSwitcher />
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
        </div>
      </div>
    </header>
  );
}
