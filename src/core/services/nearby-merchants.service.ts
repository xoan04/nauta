import {
  publicMerchantsListResponseSchema,
  type PublicMerchantsListResponse,
} from "@/core/models/public-merchants-list.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";
import type { PerlappRole } from "@/types/perlapp-role.types";

export type NearbyMerchantsParams = {
  lat: number;
  lng: number;
  radiusKm?: number;
  pageSize?: number;
};

export async function fetchNearbyMerchants(
  role: PerlappRole,
  token: string,
  { lat, lng, radiusKm = 10, pageSize = 6 }: NearbyMerchantsParams
): Promise<PublicMerchantsListResponse> {
  const endpoint =
    role === "market"
      ? "/api/v1/merchant/merchants"
      : "/api/v1/buyer/merchants";

  const raw = await apihackPublicClient.get<unknown>(endpoint, {
    token,
    params: {
      nearby_lat: lat,
      nearby_lng: lng,
      nearby_radius_km: radiusKm,
      page: 1,
      page_size: pageSize,
    },
  });
  return publicMerchantsListResponseSchema.parse(raw);
}
