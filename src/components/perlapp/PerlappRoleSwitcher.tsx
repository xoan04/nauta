"use client";

import type { PerlappRole } from "@/types/perlapp-role.types";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

const labels: Record<PerlappRole, string> = {
  invitado: "Invitado",
  comprador: "Comprador",
  market: "Market",
};

export function PerlappRoleSwitcher() {
  const role = usePerlappRoleStore((s) => s.role);
  const setRole = usePerlappRoleStore((s) => s.setRole);

  return (
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
  );
}
