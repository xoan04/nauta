import {
  merchantMyProfileResponseSchema,
  type MerchantMyProfileResponse,
} from "@/core/models/merchant-my-profile.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Perfil del comerciante autenticado.
 * GET `/api/v1/merchant/profile`
 */
export async function fetchMerchantMyProfile(token: string): Promise<MerchantMyProfileResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/merchant/profile", { token });
  return merchantMyProfileResponseSchema.parse(raw);
}
