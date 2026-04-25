"use client";

import Link from "next/link";
import { Bell, Home, Search, ShoppingCart, User } from "lucide-react";
import { cartItemCount } from "@/lib/cart.utils";
import { getProfileHrefForRole } from "@/store/perlapp-role.store";
import { useCartStore } from "@/store/cart.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

export type PerlappNavTab = "home" | "explore" | "cart" | "alerts" | "profile";

const tabBase =
  "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight transition-all duration-100 sm:text-[11px]";

function tabClass(active: boolean) {
  if (active) {
    return `${tabBase} scale-[0.97] bg-perlapp-orange/10 text-perlapp-orange`;
  }
  return `${tabBase} text-perlapp-navMuted hover:scale-[1.02] dark:text-slate-400`;
}

type PerlappBottomNavProps = {
  activeTab: PerlappNavTab;
};

export function PerlappBottomNav({ activeTab }: PerlappBottomNavProps) {
  const role = usePerlappRoleStore((s) => s.role);
  const profileHref = getProfileHrefForRole(role);
  const itemCount = useCartStore((s) => cartItemCount(s.items));
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex h-[4.25rem] w-full items-center justify-between gap-0.5 rounded-t-lg border-t border-perlapp-divider bg-white px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-perlapp-nav dark:border-slate-800 dark:bg-slate-900 md:hidden"
      aria-label="Navegación móvil"
    >
      <Link
        href="/"
        className={tabClass(activeTab === "home")}
        aria-current={activeTab === "home" ? "page" : undefined}
      >
        <Home
          className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6"
          strokeWidth={2.25}
          fill={activeTab === "home" ? "currentColor" : "none"}
        />
        <span className="truncate">Home</span>
      </Link>
      <Link href="/explore" className={tabClass(activeTab === "explore")}>
        <Search className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="truncate">Explore</span>
      </Link>
      <button
        type="button"
        className={`${tabClass(activeTab === "cart")} relative`}
        aria-label={itemCount > 0 ? `Abrir carrito, ${itemCount} artículos` : "Abrir carrito"}
        aria-current={activeTab === "cart" ? "page" : undefined}
        onClick={openDrawer}
      >
        {itemCount > 0 ? (
          <span className="absolute right-[22%] top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-perlapp-orange px-0.5 font-display text-[9px] font-bold leading-none text-white sm:right-[26%]">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
        <ShoppingCart className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="truncate">Carrito</span>
      </button>
      <Link href="/notifications" className={`${tabClass(activeTab === "alerts")} relative`}>
        <span
          className="absolute right-[18%] top-0.5 h-2 w-2 rounded-full bg-perlapp-orange sm:right-[22%]"
          aria-hidden
        />
        <Bell className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="truncate">Alertas</span>
      </Link>
      <Link
        href={profileHref}
        className={tabClass(activeTab === "profile")}
        aria-current={activeTab === "profile" ? "page" : undefined}
      >
        <User
          className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6"
          strokeWidth={2}
          fill={activeTab === "profile" ? "currentColor" : "none"}
        />
        <span className="truncate">Perfil</span>
      </Link>
    </nav>
  );
}
