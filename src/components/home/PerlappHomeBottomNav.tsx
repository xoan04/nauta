"use client";

import Link from "next/link";
import { Bell, Home, Search, ShoppingCart, User } from "lucide-react";
import { cartItemCount } from "@/lib/cart.utils";
import { useCartStore } from "@/store/cart.store";

const tabBase =
  "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight transition-all duration-100 sm:text-[11px]";

export function PerlappHomeBottomNav() {
  const itemCount = useCartStore((s) => cartItemCount(s.items));
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex h-[4.25rem] w-full items-center justify-between gap-0.5 rounded-t-lg border-t border-perlapp-divider bg-white px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-perlapp-nav dark:border-slate-800 dark:bg-slate-900 md:hidden"
      aria-label="Navegación móvil"
    >
      <Link
        href="/"
        className={`${tabBase} scale-[0.97] bg-perlapp-orange/10 text-perlapp-orange`}
        aria-current="page"
      >
        <Home className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.25} fill="currentColor" />
        <span className="truncate">Home</span>
      </Link>
      <Link
        href="/explore"
        className={`${tabBase} text-perlapp-navMuted hover:scale-[1.02] dark:text-slate-400`}
      >
        <Search className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="truncate">Explore</span>
      </Link>
      <button
        type="button"
        className={`${tabBase} relative text-perlapp-navMuted hover:scale-[1.02] dark:text-slate-400`}
        aria-label={itemCount > 0 ? `Abrir carrito, ${itemCount} artículos` : "Abrir carrito"}
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
      <Link
        href="/notifications"
        className={`${tabBase} relative text-perlapp-navMuted hover:scale-[1.02] dark:text-slate-400`}
      >
        <span
          className="absolute right-[18%] top-0.5 h-2 w-2 rounded-full bg-perlapp-orange sm:right-[22%]"
          aria-hidden
        />
        <Bell className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="truncate">Alertas</span>
      </Link>
      <Link
        href="/profile"
        className={`${tabBase} text-perlapp-navMuted hover:scale-[1.02] dark:text-slate-400`}
      >
        <User className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="truncate">Perfil</span>
      </Link>
    </nav>
  );
}
