import {
  publicMerchantsListResponseSchema,
  type PublicMerchantsListResponse,
} from "@/core/models/public-merchants-list.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Lista pública de comerciantes (sin sesión). `GET /api/v1/merchants`.
 */
export async function fetchPublicMerchantsList(): Promise<PublicMerchantsListResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/merchants");
  return publicMerchantsListResponseSchema.parse(raw);
}
