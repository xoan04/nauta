import {
  publicMerchantDetailResponseSchema,
  type PublicMerchantDetailResponse,
} from "@/core/models/merchant-public-detail.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Detalle público de comerciante por `userId`.
 * GET `/api/v1/merchants/:userId`
 */
export async function fetchPublicMerchantDetail(userId: string): Promise<PublicMerchantDetailResponse> {
  const raw = await apihackPublicClient.get<unknown>(`/api/v1/merchants/${encodeURIComponent(userId)}`);
  return publicMerchantDetailResponseSchema.parse(raw);
}
