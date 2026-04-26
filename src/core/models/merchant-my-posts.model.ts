import { z } from "zod";

const merchantPostPhotoSchema = z.object({
  id: z.string(),
  publication_id: z.string(),
  url: z.string(),
  order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

const merchantPostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  profile_merchant_id: z.string(),
  business_id: z.string().nullable(),
  content: z.string(),
  publication_type_id: z.string().nullable(),
  publication_type_code: z.string().nullable(),
  publication_type_name: z.string().nullable(),
  likes: z.number(),
  url: z.string().nullable(),
  order: z.number(),
  photos: z.array(merchantPostPhotoSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export const merchantMyPostsResponseSchema = z.object({
  posts: z.array(merchantPostSchema),
  total: z.number(),
});

export type MerchantMyPost = z.infer<typeof merchantPostSchema>;
export type MerchantMyPostsResponse = z.infer<typeof merchantMyPostsResponseSchema>;
