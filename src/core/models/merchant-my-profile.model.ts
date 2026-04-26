import { z } from "zod";

export const gamificationSchema = z.object({
  has_default_business: z.boolean(),
  stage_dream_architect: z.boolean(),
  stage_ciiu_navigator: z.boolean(),
  stage_territorial_ambassador: z.boolean(),
  stage_microenterprise_titan: z.boolean(),
  stage_connections_master: z.boolean(),
  stage_samaria_pro_entrepreneur: z.boolean(),
  current_stage: z.number(),
  onboarding_completed: z.boolean(),
});

export type Gamification = z.infer<typeof gamificationSchema>;

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
  municipality_id: z.string().nullable().optional(),
  /** Teléfono de contacto del negocio (p. ej. etapa de conexiones del onboarding). */
  phone: z.string().nullable().optional(),
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
  gamification: gamificationSchema.optional().nullable(),
});

export type MerchantMyProfileResponse = z.infer<typeof merchantMyProfileResponseSchema>;
