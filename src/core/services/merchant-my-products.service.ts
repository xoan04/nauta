import {
  merchantMyProductsResponseSchema,
  type MerchantMyProductsResponse,
} from "@/core/models/merchant-my-products.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Productos del comerciante autenticado.
 * GET `/api/v1/merchant/products`
 */
export async function fetchMerchantMyProducts(token: string): Promise<MerchantMyProductsResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/merchant/products", { token });
  return merchantMyProductsResponseSchema.parse(raw);
}
