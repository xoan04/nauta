"use client";

import { Link2 } from "lucide-react";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

type MerchantLite = { id: string; title: string };

type MerchantConnectBetweenProps = {
  left: MerchantLite;
  right: MerchantLite;
};

export function MerchantConnectBetween({ left, right }: MerchantConnectBetweenProps) {
  const role = usePerlappRoleStore((s) => s.role);
  const connectMerchantPair = useBuyerActivityStore((s) => s.connectMerchantPair);
  const pairs = useBuyerActivityStore((s) => s.connectionPairs);
  const key = [left.id, right.id].sort().join("|");
  const already = pairs.some((p) => p.key === key);

  if (role !== "market") return null;

  return (
    <div className="flex w-11 shrink-0 flex-col items-center justify-center self-stretch py-2">
      <button
        type="button"
        disabled={already}
        onClick={() => connectMerchantPair(left.id, right.id)}
        className="flex min-h-[100px] w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-perlapp-tertiary/50 bg-perlapp-surfaceContainer/80 px-1 py-2 font-display text-[10px] font-bold uppercase tracking-wide text-perlapp-tertiary transition-colors hover:border-perlapp-tertiary hover:bg-perlapp-tertiary/10 disabled:cursor-default disabled:border-perlapp-line disabled:bg-perlapp-surfaceVariant disabled:text-perlapp-inkMuted"
        aria-label={`Conectar ${left.title} con ${right.title}`}
      >
        <Link2 className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        {already ? "Listo" : "Conectar"}
      </button>
    </div>
  );
}
