import {
  createMerchantProductInputSchema,
  type CreateMerchantProductInput,
  type CreateMerchantProductResponse,
} from "@/core/models/merchant-create-product.model";
import { createMerchantProduct } from "@/core/services/merchant-create-product.service";

export async function createMerchantProductUseCase(
  token: string,
  input: CreateMerchantProductInput,
): Promise<CreateMerchantProductResponse> {
  const parsed = createMerchantProductInputSchema.parse(input);
  return createMerchantProduct(token, parsed);
}
