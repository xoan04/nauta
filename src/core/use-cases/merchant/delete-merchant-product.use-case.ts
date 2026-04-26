import { deleteMerchantProduct } from "@/core/services/merchant-delete-product.service";

export async function deleteMerchantProductUseCase(token: string, productId: string): Promise<void> {
  await deleteMerchantProduct(token, productId);
}
