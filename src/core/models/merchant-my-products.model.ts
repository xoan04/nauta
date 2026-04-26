import { z } from "zod";

const merchantProductPhotoSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  photo: z.string(),
  order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

const merchantProductSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  profile_merchant_id: z.string(),
  business_id: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  available: z.boolean(),
  photos: z.array(merchantProductPhotoSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export const merchantMyProductsResponseSchema = z.object({
  products: z.array(merchantProductSchema),
  total: z.number(),
});

export type MerchantMyProduct = z.infer<typeof merchantProductSchema>;
export type MerchantMyProductsResponse = z.infer<typeof merchantMyProductsResponseSchema>;
