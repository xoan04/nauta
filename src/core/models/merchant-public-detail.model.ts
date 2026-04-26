import { z } from "zod";

const merchantUserSchema = z.object({
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

const merchantProfileSchema = z.object({
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

const merchantBusinessSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    profile_merchant_id: z.string(),
    business_name: z.string(),
    description: z.string(),
    business_category_id: z.string().nullable(),
    ciiu_code: z.string().nullable().optional(),
    stage: z.string().nullable().optional(),
    municipality_id: z.string().nullable(),
    is_verified: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .passthrough();

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
  business_id: z.string(),
  content: z.string(),
  publication_type_id: z.string(),
  publication_type_code: z.string(),
  publication_type_name: z.string(),
  likes: z.number(),
  url: z.string().nullable().optional(),
  order: z.number(),
  photos: z.array(merchantPostPhotoSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

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
  business_id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  available: z.boolean(),
  photos: z.array(merchantProductPhotoSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

const merchantBusinessCategorySchema = z
  .object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .passthrough();

const merchantMunicipalitySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .passthrough();

const merchantBusinessItemSchema = z.object({
  business: merchantBusinessSchema,
  business_category: merchantBusinessCategorySchema.nullable(),
  municipality: merchantMunicipalitySchema.nullable(),
});

export const publicMerchantDetailResponseSchema = z.object({
  user: merchantUserSchema,
  profile_merchant: merchantProfileSchema.nullable(),
  businesses: z.array(merchantBusinessItemSchema),
  posts: z.array(merchantPostSchema),
  products: z.array(merchantProductSchema),
});

export type PublicMerchantDetailResponse = z.infer<typeof publicMerchantDetailResponseSchema>;
