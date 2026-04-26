import { z } from "zod";

const myMerchantUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  status: z.string(),
  role: z.string(),
  register_by: z.string(),
  last_login_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const myMerchantProfileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  formalized: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const merchantMyProfileResponseSchema = z.object({
  user: myMerchantUserSchema,
  profile_merchant: myMerchantProfileSchema.nullable(),
  builder_profile: z.unknown().nullable(),
  labour_profile: z.unknown().nullable(),
  organizations: z.array(z.unknown()),
  current_role: z.string(),
  has_builder_profile: z.boolean(),
  has_labour_profile: z.boolean(),
});

export type MerchantMyProfileResponse = z.infer<typeof merchantMyProfileResponseSchema>;
