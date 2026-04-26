import {
  publicMerchantRegisterBodySchema,
  type PublicMerchantRegisterBody,
  type PublicMerchantRegisterResponse,
} from "@/core/models/merchant-public-registration.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Registro público de comerciante (sin sesión).
 */
export async function registerPublicMerchant(
  body: PublicMerchantRegisterBody
): Promise<PublicMerchantRegisterResponse> {
  const parsed = publicMerchantRegisterBodySchema.parse(body);
  const raw = await apihackPublicClient.post<unknown, PublicMerchantRegisterBody>(
    "/api/v1/public/merchants",
    parsed
  );
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return { ...(raw as Record<string, unknown>) };
  }
  return {};
}
