"use client";

import dynamic from "next/dynamic";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";

const ExplorarMapDiscoverView = dynamic(
  () => import("@/components/explorar/ExplorarMapDiscoverView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background text-brand-teal">
        <p className="text-sm font-medium">Cargando mapa…</p>
      </div>
    ),
  }
);

export function ExplorarPageClient() {
  return (
    <>
      <PerlappHomeHeader />
      <ExplorarMapDiscoverView />
      <CartDrawer />
    </>
  );
}
