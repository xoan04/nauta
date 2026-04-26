import { z } from "zod";

const feedActorSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  photo: z.string().nullable(),
  photo_banner: z.string().nullable(),
});

const feedPhotoSchema = z.object({
  id: z.string(),
  publication_id: z.string(),
  url: z.string(),
  order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const feedPostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  profile_merchant_id: z.string(),
  business_id: z.string(),
  content: z.string(),
  publication_type_id: z.string(),
  publication_type_code: z.string(),
  publication_type_name: z.string(),
  likes: z.number(),
  url: z.string(),
  order: z.number(),
  photos: z.array(feedPhotoSchema),
  created_at: z.string(),
  updated_at: z.string(),
  merchant: feedActorSchema,
  business: feedActorSchema,
});

export const feedResponseSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  posts: z.array(feedPostSchema),
  total: z.number(),
  total_pages: z.number(),
});

export type FeedPost = z.infer<typeof feedPostSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
