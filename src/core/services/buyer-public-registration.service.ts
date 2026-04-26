import { apihackPublicClient } from "@/core/services/apihack-public-client";
import {
  publicBuyerRegisterBodySchema,
  type PublicBuyerRegisterBody,
  type PublicBuyerRegisterResponse,
} from "@/core/models/buyer-public-registration.model";

/**
 * Registro público de comprador (sin sesión).
 */
export async function registerPublicBuyer(
  body: PublicBuyerRegisterBody
): Promise<PublicBuyerRegisterResponse> {
  const parsed = publicBuyerRegisterBodySchema.parse(body);
  const raw = await apihackPublicClient.post<unknown, PublicBuyerRegisterBody>(
    "/api/v1/public/buyers",
    parsed
  );
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return { ...(raw as Record<string, unknown>) };
  }
  return {};
}
