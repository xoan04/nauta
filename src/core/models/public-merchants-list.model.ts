import { z } from "zod";

const publicMerchantUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  status: z.string(),
  role: z.string(),
  register_by: z.string(),
  last_login_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  role_changed_at: z.string().nullable(),
});

const publicMerchantProfileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  phone: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  municipality_id: z.string().nullable(),
  municipality_name: z.string().nullable(),
  formalized: z.boolean(),
  photo: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const publicMerchantBusinessItemSchema = z.object({
  business: z
    .object({
      id: z.string(),
      user_id: z.string(),
      profile_merchant_id: z.string(),
      nombre: z.string().optional().nullable(),
      name: z.string().optional().nullable(),
      business_name: z.string().optional().nullable(),
      descripcion: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      business_category_id: z.string().nullable(),
      municipality_id: z.string().nullable(),
      verificado: z.boolean().optional().nullable(),
      verified: z.boolean().optional().nullable(),
      is_verified: z.boolean().optional().nullable(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .passthrough(),
  business_category: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      is_active: z.boolean(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .passthrough()
    .nullable(),
  municipality: z
    .object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      is_active: z.boolean(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .passthrough()
    .nullable(),
});

export const publicMerchantListItemSchema = z.object({
  user: publicMerchantUserSchema,
  profile_merchant: publicMerchantProfileSchema.nullable(),
  businesses: z.array(publicMerchantBusinessItemSchema),
  posts: z.array(z.unknown()),
  products: z.array(z.unknown()),
});

export const publicMerchantsListResponseSchema = z.object({
  merchants: z.array(publicMerchantListItemSchema),
  total: z.number(),
});

export type PublicMerchantListItem = z.infer<typeof publicMerchantListItemSchema>;
export type PublicMerchantsListResponse = z.infer<typeof publicMerchantsListResponseSchema>;
