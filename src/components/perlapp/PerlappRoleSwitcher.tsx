"use client";

import type { PerlappRole } from "@/types/perlapp-role.types";
import { getMerchantProfileById } from "@/lib/merchant-profile.mock";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

const labels: Record<PerlappRole, string> = {
  invitado: "Invitado",
  comprador: "Comprador",
  market: "Comercio",
};

export function PerlappRoleSwitcher() {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const setRole = usePerlappRoleStore((s) => s.setRole);
  const setActiveMarketId = usePerlappRoleStore((s) => s.setActiveMarketId);

  const marketOptions = ["1", "2", "3", "4", "ecovolt"];

  return (
    <div className="flex min-w-0 items-center gap-1">
      <label className="flex min-w-0 items-center gap-1">
        <span className="sr-only">Rol de demostración</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as PerlappRole)}
          className="max-w-[7.5rem] cursor-pointer rounded-lg border border-perlapp-divider bg-perlapp-white px-2 py-1 font-display text-[11px] font-semibold text-perlapp-teal shadow-sm focus:outline-none focus:ring-2 focus:ring-perlapp-orange md:max-w-[9rem] md:text-xs"
        >
          {(Object.keys(labels) as PerlappRole[]).map((r) => (
            <option key={r} value={r}>
              {labels[r]}
            </option>
          ))}
        </select>
      </label>
      {role === "market" ? (
        <label className="flex min-w-0 items-center gap-1">
          <span className="sr-only">Comercio activo</span>
          <select
            value={activeMarketId}
            onChange={(e) => setActiveMarketId(e.target.value)}
            className="max-w-[6.75rem] cursor-pointer rounded-lg border border-perlapp-divider bg-perlapp-white px-2 py-1 font-display text-[11px] font-semibold text-perlapp-teal shadow-sm focus:outline-none focus:ring-2 focus:ring-perlapp-orange md:max-w-[8rem] md:text-xs"
          >
            {marketOptions.map((id) => (
              <option key={id} value={id}>
                {getMerchantProfileById(id)?.displayName ?? id}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
