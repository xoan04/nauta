import {
  publicMerchantsListResponseSchema,
  type PublicMerchantsListResponse,
} from "@/core/models/public-merchants-list.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";
import type { PerlappRole } from "@/types/perlapp-role.types";

export async function fetchFeaturedMerchants(
  role: PerlappRole,
  token: string
): Promise<PublicMerchantsListResponse> {
  const endpoint =
    role === "market"
      ? "/api/v1/merchant/merchants/stage-2-completed"
      : "/api/v1/buyer/merchants/stage-2-completed";

  const raw = await apihackPublicClient.get<unknown>(endpoint, { token });
  return publicMerchantsListResponseSchema.parse(raw);
}
