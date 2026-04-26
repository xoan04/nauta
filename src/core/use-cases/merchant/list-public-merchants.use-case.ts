import type { PublicMerchantsListResponse } from "@/core/models/public-merchants-list.model";
import { fetchPublicMerchantsList } from "@/core/services/public-merchants-list.service";

export async function listPublicMerchantsUseCase(): Promise<PublicMerchantsListResponse> {
  return fetchPublicMerchantsList();
}
