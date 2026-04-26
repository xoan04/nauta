import {
  publicMerchantsListResponseSchema,
  type PublicMerchantsListResponse,
} from "@/core/models/public-merchants-list.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";
import type { PerlappRole } from "@/types/perlapp-role.types";

/**
 * Lista de comerciantes dinámica. `GET /api/v1/merchants` o según el rol.
 */
export async function fetchPublicMerchantsList(
  role: PerlappRole | "invitado" = "invitado",
  token?: string | null
): Promise<PublicMerchantsListResponse> {
  let endpoint = "/api/v1/merchants";

  if (role === "market") {
    endpoint = "/api/v1/merchant/merchants";
  } else if (role === "comprador") {
    endpoint = "/api/v1/buyer/merchants";
  }

  const options = token ? { token } : undefined;
  const raw = await apihackPublicClient.get<unknown>(endpoint, options);
  return publicMerchantsListResponseSchema.parse(raw);
}
