import { deleteMerchantPost } from "@/core/services/merchant-delete-post.service";

export async function deleteMerchantPostUseCase(token: string, postId: string): Promise<void> {
  await deleteMerchantPost(token, postId);
}
