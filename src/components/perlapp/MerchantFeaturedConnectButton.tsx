"use client";

import { CheckCircle2, Clock, Link2 } from "lucide-react";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { cn } from "@/lib/utils";

type MerchantFeaturedConnectButtonProps = {
  merchantId: string;
  merchantTitle: string;
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

export function MerchantFeaturedConnectButton({
  merchantId,
  merchantTitle,
}: MerchantFeaturedConnectButtonProps) {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const sendRequest = useMarketConnectionsStore((s) => s.sendRequest);
  const requests = useMarketConnectionsStore((s) => s.requests);

  if (role !== "market") return null;
  if (activeMarketId === merchantId) return null;

  const key = activeMarketId ? pairKey(activeMarketId, merchantId) : "";
  const pairMatches = activeMarketId
    ? requests.filter((r) => pairKey(r.fromMerchantId, r.toMerchantId) === key)
    : [];
  const hasAccepted = pairMatches.some((r) => r.status === "aceptada");
  const hasPending = pairMatches.some((r) => r.status === "pendiente");
  const canSend = Boolean(activeMarketId) && !hasAccepted && !hasPending;
  const state = hasAccepted ? "aceptada" : hasPending ? "pendiente" : "idle";

  return (
    <button
      type="button"
      disabled={!canSend}
      title={
        !activeMarketId
          ? "Elige tu comercio con el selector de rol para enviar solicitudes B2B."
          : hasAccepted
            ? `Conexión activa con ${merchantTitle}`
            : hasPending
              ? "Solicitud enviada. El otro comercio puede responder en notificaciones."
              : `Solicitar conexión B2B con ${merchantTitle}`
      }
      onClick={(e) => {
        e.preventDefault();
        if (!activeMarketId || !canSend) return;
        sendRequest(activeMarketId, merchantId);
      }}
      className={cn(
        "pointer-events-auto absolute right-perlapp-sm top-perlapp-sm z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-display text-[11px] font-bold leading-none shadow-md backdrop-blur-md transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perlapp-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        state === "idle" &&
          activeMarketId &&
          "border-white/40 bg-white/90 text-perlapp-tertiary hover:border-perlapp-tertiary/50 hover:bg-white active:scale-[0.98]",
        state === "idle" &&
          !activeMarketId &&
          "cursor-not-allowed border-white/25 bg-black/35 text-white/70",
        state === "pendiente" &&
          "border-amber-300/90 bg-amber-50/95 text-amber-950 hover:bg-amber-50",
        state === "aceptada" &&
          "border-emerald-400/80 bg-emerald-50/95 text-emerald-950 hover:bg-emerald-50"
      )}
      aria-label={`Conectar con ${merchantTitle}`}
    >
      {state === "aceptada" ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      ) : state === "pendiente" ? (
        <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      ) : (
        <Link2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      )}
      <span className="max-w-[5.5rem] truncate sm:max-w-[7rem]">
        {hasAccepted ? "Conectado" : hasPending ? "Pendiente" : "Conectar"}
      </span>
    </button>
  );
}
