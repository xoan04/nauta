import {
  updateMerchantPostInputSchema,
  type UpdateMerchantPostInput,
  type UpdateMerchantPostResponse,
} from "@/core/models/merchant-update-post.model";
import { updateMerchantPost } from "@/core/services/merchant-update-post.service";

export async function updateMerchantPostUseCase(
  token: string,
  postId: string,
  input: UpdateMerchantPostInput
): Promise<UpdateMerchantPostResponse> {
  const parsed = updateMerchantPostInputSchema.parse(input);
  return updateMerchantPost(token, postId, parsed);
}
