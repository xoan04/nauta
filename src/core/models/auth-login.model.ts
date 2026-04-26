import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Introduce la contraseña"),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginResponseUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  status: z.string().optional(),
  role: z.string(),
  register_by: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const loginProfilesSchema = z
  .object({
    has_builder_profile: z.boolean().optional(),
    has_labour_profile: z.boolean().optional(),
    has_merchant_profile: z.boolean().optional(),
    has_admin_profile: z.boolean().optional(),
    has_buyer_profile: z.boolean().optional(),
    has_any_profile: z.boolean().optional(),
  })
  .passthrough();

export const loginResponseSchema = z.object({
  user: loginResponseUserSchema,
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  profiles: loginProfilesSchema.optional(),
});

export type AuthSessionUser = z.infer<typeof loginResponseUserSchema>;
export type LoginProfiles = z.infer<typeof loginProfilesSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
