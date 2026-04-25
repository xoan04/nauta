"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { ExplorarGuestLanding } from "@/components/explorar/ExplorarGuestLanding";

const ExplorarMapDiscoverView = dynamic(
  () => import("@/components/explorar/ExplorarMapDiscoverView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100dvh] items-center justify-center bg-brand-sand text-brand-teal">
        <p className="text-sm font-medium">Cargando mapa…</p>
      </div>
    ),
  }
);

export function ExplorarPageClient() {
  const [hydrated, setHydrated] = useState(() => usePerlappRoleStore.persist.hasHydrated());
  const role = usePerlappRoleStore((s) => s.role);

  useEffect(() => {
    const unsub = usePerlappRoleStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-sand text-brand-stone">
        <p className="text-sm">Cargando…</p>
      </div>
    );
  }

  if (role === "comprador" || role === "market") {
    return <ExplorarMapDiscoverView />;
  }

  return <ExplorarGuestLanding />;
}
