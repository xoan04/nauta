import {
  updateMerchantProductInputSchema,
  type UpdateMerchantProductInput,
  type UpdateMerchantProductResponse,
} from "@/core/models/merchant-update-product.model";
import { updateMerchantProduct } from "@/core/services/merchant-update-product.service";

export async function updateMerchantProductUseCase(
  token: string,
  productId: string,
  input: UpdateMerchantProductInput,
): Promise<UpdateMerchantProductResponse> {
  const parsed = updateMerchantProductInputSchema.parse(input);
  return updateMerchantProduct(token, productId, parsed);
}
