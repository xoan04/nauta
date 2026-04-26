import type { PublicMerchantsListResponse } from "@/core/models/public-merchants-list.model";
import { fetchPublicMerchantsList } from "@/core/services/public-merchants-list.service";
import type { PerlappRole } from "@/types/perlapp-role.types";

export async function listPublicMerchantsUseCase(
  role?: PerlappRole | "invitado",
  token?: string | null
): Promise<PublicMerchantsListResponse> {
  return fetchPublicMerchantsList(role, token);
}
