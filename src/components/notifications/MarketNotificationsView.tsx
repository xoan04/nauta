"use client";

import Link from "next/link";
import { ArrowRight, BellRing, Check, Link2, X } from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappBottomNav } from "@/components/home/PerlappBottomNav";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";
import { Button } from "@/components/ui/button";
import { getMerchantProfileById } from "@/lib/merchant-profile.mock";
import { cn } from "@/lib/utils";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

function statusLabel(status: "pendiente" | "aceptada" | "rechazada") {
  if (status === "aceptada") return "Aceptada";
  if (status === "rechazada") return "Rechazada";
  return "Pendiente";
}

export function MarketNotificationsView() {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const requests = useMarketConnectionsStore((s) => s.requests);
  const acceptRequest = useMarketConnectionsStore((s) => s.acceptRequest);
  const rejectRequest = useMarketConnectionsStore((s) => s.rejectRequest);

  if (role !== "market") {
    return (
      <div className="min-h-screen bg-perlapp-canvas pb-28 pt-20 text-perlapp-ink md:pb-0 md:pt-24">
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

  const activeName =
    getMerchantProfileById(activeMarketId)?.displayName ?? activeMarketId;

  const incomingPending = requests.filter(
    (r) => r.toMerchantId === activeMarketId && r.status === "pendiente"
  );
  const outgoingPending = requests.filter(
    (r) => r.fromMerchantId === activeMarketId && r.status === "pendiente"
  );
  const resolved = requests
    .filter(
      (r) =>
        (r.toMerchantId === activeMarketId || r.fromMerchantId === activeMarketId) &&
        (r.status === "aceptada" || r.status === "rechazada")
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="min-h-screen bg-perlapp-canvas pb-28 pt-20 text-perlapp-ink md:pb-0 md:pt-24">
      <PerlappHomeHeader />
      <main className="mx-auto w-full max-w-2xl border-x border-perlapp-line/30 bg-perlapp-white shadow-sm md:shadow-perlapp-float">
        <header className="border-b border-perlapp-line/40 px-perlapp-md py-perlapp-md">
          <h1 className="font-display text-perlapp-headline-md leading-tight">Notificaciones</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-1 text-sm text-perlapp-inkMuted">
            <span className="font-medium text-perlapp-ink">Comercio activo:</span>
            <span>{activeName}</span>
          </p>
        </header>

        <section className="border-b border-perlapp-line/30 px-perlapp-md py-perlapp-md">
          <h2 className="font-display text-sm font-bold tracking-tight text-perlapp-ink">
            Solicitudes entrantes
          </h2>
          <p className="mt-1 text-xs text-perlapp-inkMuted">
            Otros comercios quieren conectar contigo. Responde aquí.
          </p>
          {incomingPending.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-perlapp-line/60 bg-perlapp-surfaceLow/50 px-4 py-6 text-center text-sm text-perlapp-inkMuted">
              No tienes solicitudes pendientes por revisar.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {incomingPending.map((req) => {
                const sender = getMerchantProfileById(req.fromMerchantId);
                const senderName = sender?.displayName ?? req.fromMerchantId;
                return (
                  <li
                    key={req.id}
                    className="overflow-hidden rounded-2xl border border-perlapp-line/50 bg-perlapp-white shadow-[0_2px_12px_-4px_rgba(38,24,20,0.08)]"
                  >
                    <div className="flex items-start gap-3 border-b border-perlapp-line/30 bg-perlapp-surfaceLow/40 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-perlapp-tertiary/10 text-perlapp-tertiary">
                        <Link2 className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold text-perlapp-ink">
                          Solicitud de conexión B2B
                        </p>
                        <p className="mt-1 text-sm leading-snug text-perlapp-inkMuted">
                          <span className="font-medium text-perlapp-ink">{senderName}</span> te envió
                          una solicitud de conexión.
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-amber-900">
                        Nueva
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="order-2 w-full border-perlapp-line font-display sm:order-1 sm:w-auto"
                        onClick={() => rejectRequest(req.id)}
                      >
                        <X className="mr-2 h-4 w-4" aria-hidden />
                        Rechazar
                      </Button>
                      <Button
                        type="button"
                        className="order-1 w-full bg-perlapp-orange font-display text-white hover:bg-perlapp-orange/90 sm:order-2 sm:w-auto"
                        onClick={() => acceptRequest(req.id)}
                      >
                        <Check className="mr-2 h-4 w-4" aria-hidden />
                        Aceptar
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {outgoingPending.length > 0 ? (
          <section className="border-b border-perlapp-line/30 px-perlapp-md py-perlapp-md">
            <h2 className="font-display text-sm font-bold tracking-tight text-perlapp-ink">
              Enviadas · esperando respuesta
            </h2>
            <p className="mt-1 text-xs text-perlapp-inkMuted">
              Cuando el otro comercio responda, verás el resultado en el historial.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {outgoingPending.map((req) => {
                const target = getMerchantProfileById(req.toMerchantId);
                const targetName = target?.displayName ?? req.toMerchantId;
                return (
                  <li
                    key={req.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-perlapp-line/40 bg-perlapp-surfaceContainer/60 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-2 text-sm">
                      <span className="truncate font-medium text-perlapp-ink">{activeName}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-perlapp-inkMuted" aria-hidden />
                      <span className="truncate font-medium text-perlapp-ink">{targetName}</span>
                    </div>
                    <span className="rounded-full bg-amber-100/90 px-2.5 py-1 font-display text-[11px] font-semibold text-amber-950">
                      Pendiente
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className="px-perlapp-md py-perlapp-md">
          <h2 className="font-display text-sm font-bold tracking-tight text-perlapp-ink">Historial</h2>
          <p className="mt-1 text-xs text-perlapp-inkMuted">
            Conexiones ya respondidas (aceptadas o rechazadas).
          </p>
          {resolved.length === 0 ? (
            <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-perlapp-line/60 bg-perlapp-surfaceLow/30 px-4 py-8 text-center text-sm text-perlapp-inkMuted">
              <BellRing className="h-8 w-8 text-perlapp-line" strokeWidth={1.5} aria-hidden />
              Aún no hay movimientos en el historial.
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {resolved.map((r) => {
                const fromName =
                  getMerchantProfileById(r.fromMerchantId)?.displayName ?? r.fromMerchantId;
                const toName =
                  getMerchantProfileById(r.toMerchantId)?.displayName ?? r.toMerchantId;
                return (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-perlapp-line/35 bg-perlapp-white px-4 py-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                      <span className="truncate text-perlapp-ink">{fromName}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-perlapp-inkMuted" aria-hidden />
                      <span className="truncate text-perlapp-ink">{toName}</span>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 font-display text-[11px] font-semibold",
                        r.status === "aceptada" &&
                          "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80",
                        r.status === "rechazada" && "bg-perlapp-surfaceVariant text-perlapp-inkMuted"
                      )}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <PerlappBottomNav activeTab="alerts" />
      <CartDrawer />
    </div>
  );
}
