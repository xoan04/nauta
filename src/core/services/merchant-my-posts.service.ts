import {
  merchantMyPostsResponseSchema,
  type MerchantMyPostsResponse,
} from "@/core/models/merchant-my-posts.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Publicaciones del comerciante autenticado.
 * GET `/api/v1/merchant/posts`
 */
export async function fetchMerchantMyPosts(token: string): Promise<MerchantMyPostsResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/merchant/posts", { token });
  return merchantMyPostsResponseSchema.parse(raw);
}
