"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { cartItemCount } from "@/lib/cart.utils";
import { useCartStore } from "@/store/cart.store";

const navLink =
  "font-display font-semibold text-base rounded-lg px-perlapp-sm py-perlapp-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800";

export function PerlappHomeHeader() {
  const itemCount = useCartStore((s) => cartItemCount(s.items));
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-perlapp-divider bg-perlapp-header shadow-perlapp-float dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-perlapp-xs">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight text-perlapp-orange"
          >
            Perlapp
          </Link>
        </div>

        <nav className="hidden items-center gap-perlapp-md md:flex" aria-label="Principal">
          <Link href="/" className={`${navLink} font-bold text-perlapp-orange`}>
            Home
          </Link>
          <Link
            href="/explore"
            className={`${navLink} text-perlapp-teal dark:text-slate-400`}
          >
            Explore
          </Link>
          <Link
            href="/notifications"
            className={`${navLink} text-perlapp-teal dark:text-slate-400`}
          >
            Notifications
          </Link>
          <Link
            href="/profile"
            className={`${navLink} text-perlapp-teal dark:text-slate-400`}
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-perlapp-sm">
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
