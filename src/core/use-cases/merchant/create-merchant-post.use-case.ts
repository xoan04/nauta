import {
  createMerchantPostInputSchema,
  type CreateMerchantPostInput,
  type CreateMerchantPostResponse,
} from "@/core/models/merchant-create-post.model";
import { createMerchantPost } from "@/core/services/merchant-create-post.service";

export async function createMerchantPostUseCase(
  input: CreateMerchantPostInput,
  token: string
): Promise<CreateMerchantPostResponse> {
  const parsed = createMerchantPostInputSchema.parse({
    content: input.content.trim(),
    publication_type_id: input.publication_type_id,
    photos: input.photos ?? [],
  });
  return createMerchantPost(parsed, token);
}
