import type { PerlappRole } from "@/types/perlapp-role.types";

/** Mapea `role` del API (`merchant`, `buyer`, …) al rol de experiencia Perlapp. */
export function mapApiRoleToPerlappRole(apiRole: string): PerlappRole {
  const r = apiRole.trim().toLowerCase();
  if (r === "merchant") return "market";
  if (r === "buyer" || r === "comprador") return "comprador";
  return "invitado";
}
