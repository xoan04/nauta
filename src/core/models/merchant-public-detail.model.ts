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
    nombre: z.string(),
    descripcion: z.string(),
    business_category_id: z.string().nullable(),
    municipality_id: z.string().nullable(),
    verificado: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .passthrough();

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
  posts: z.array(z.unknown()),
  products: z.array(z.unknown()),
});

export type PublicMerchantDetailResponse = z.infer<typeof publicMerchantDetailResponseSchema>;
