import type { ProfileCatalogProduct } from "@/lib/merchant-catalog.types";
import { fetchMerchantMyProducts } from "@/core/services/merchant-my-products.service";

export async function getMyMerchantProductsUseCase(token: string): Promise<ProfileCatalogProduct[]> {
  const data = await fetchMerchantMyProducts(token);
  return data.products.map((product) => {
    const primaryPhoto = product.photos.slice().sort((a, b) => a.order - b.order)[0];
    const imageUrl = primaryPhoto?.photo?.trim() ?? "";
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      imageUrl,
    };
  });
}
