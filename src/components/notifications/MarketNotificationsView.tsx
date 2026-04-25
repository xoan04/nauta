"use client";

import Link from "next/link";
import { BellRing } from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappBottomNav } from "@/components/home/PerlappBottomNav";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";
import { Button } from "@/components/ui/button";
import { getMerchantProfileById } from "@/lib/merchant-profile.mock";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

export function MarketNotificationsView() {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const requests = useMarketConnectionsStore((s) => s.requests);
  const acceptRequest = useMarketConnectionsStore((s) => s.acceptRequest);
  const rejectRequest = useMarketConnectionsStore((s) => s.rejectRequest);

  if (role !== "market") {
    return (
      <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
        <PerlappHomeHeader />
        <main className="mx-auto max-w-2xl px-perlapp-margin-mobile py-perlapp-lg md:px-perlapp-margin-desktop">
          <h1 className="font-display text-perlapp-headline-md">Notificaciones</h1>
          <p className="mt-2 text-perlapp-inkMuted">
            Esta bandeja es para solicitudes de conexión entre comercios. Cambia al rol
            <strong> Comercio</strong> para gestionarlas.
          </p>
          <Button asChild className="mt-6 bg-perlapp-orange text-white hover:bg-perlapp-orange/90">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </main>
        <PerlappBottomNav activeTab="alerts" />
        <CartDrawer />
      </div>
    );
  }

  const incomingPending = requests.filter(
    (r) => r.toMerchantId === activeMarketId && r.status === "pendiente"
  );
  const recent = requests.filter(
    (r) =>
      r.toMerchantId === activeMarketId ||
      r.fromMerchantId === activeMarketId
  );

  return (
    <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
      <PerlappHomeHeader />
      <main className="mx-auto w-full max-w-2xl border-x border-perlapp-line/30 bg-perlapp-white">
        <header className="border-b border-perlapp-line/40 p-4">
          <h1 className="font-display text-perlapp-headline-md">Notificaciones</h1>
          <p className="mt-1 text-sm text-perlapp-inkMuted">
            Comercio activo: {getMerchantProfileById(activeMarketId)?.displayName ?? activeMarketId}
          </p>
        </header>

        <section className="border-b border-perlapp-line/30 p-4">
          <h2 className="font-display text-sm font-bold text-perlapp-ink">Solicitudes pendientes</h2>
          {incomingPending.length === 0 ? (
            <p className="mt-2 text-sm text-perlapp-inkMuted">No tienes solicitudes pendientes.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {incomingPending.map((req) => {
                const sender = getMerchantProfileById(req.fromMerchantId);
                return (
                  <li key={req.id} className="rounded-xl border border-perlapp-line/40 p-3">
                    <p className="font-display text-sm">
                      <strong>{sender?.displayName ?? req.fromMerchantId}</strong> te envio una solicitud
                      de conexion.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        type="button"
                        className="bg-perlapp-orange text-white hover:bg-perlapp-orange/90"
                        onClick={() => acceptRequest(req.id)}
                      >
                        Aceptar
                      </Button>
                      <Button type="button" variant="outline" onClick={() => rejectRequest(req.id)}>
                        Rechazar
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="p-4">
          <h2 className="font-display text-sm font-bold text-perlapp-ink">Historial</h2>
          {recent.length === 0 ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-perlapp-inkMuted">
              <BellRing className="h-4 w-4" />
              Aun no hay movimientos.
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {recent.map((r) => (
                <li key={r.id} className="rounded-lg border border-perlapp-line/30 px-3 py-2 text-sm">
                  {getMerchantProfileById(r.fromMerchantId)?.displayName ?? r.fromMerchantId} →{" "}
                  {getMerchantProfileById(r.toMerchantId)?.displayName ?? r.toMerchantId}:{" "}
                  <span className="font-semibold">{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <PerlappBottomNav activeTab="alerts" />
      <CartDrawer />
    </div>
  );
}

