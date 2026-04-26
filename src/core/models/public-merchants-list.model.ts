import { z } from "zod";

export const publicMerchantListItemSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  profile_merchant_id: z.string().optional(),
});

export const publicMerchantsListResponseSchema = z.object({
  merchants: z.array(publicMerchantListItemSchema),
  total: z.number(),
});

export type PublicMerchantListItem = z.infer<typeof publicMerchantListItemSchema>;
export type PublicMerchantsListResponse = z.infer<typeof publicMerchantsListResponseSchema>;
