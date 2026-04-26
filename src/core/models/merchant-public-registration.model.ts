import { z } from "zod";

/** Cuerpo enviado a `POST /api/v1/public/merchants`. */
export const publicMerchantRegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
});

export type PublicMerchantRegisterBody = z.infer<typeof publicMerchantRegisterBodySchema>;

const merchantLocationSchema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite(),
  address: z.string(),
});

/** Entrada del formulario multi-paso (sin `confirmPassword`). */
export const registerPublicMerchantFormInputSchema = z.object({
  businessName: z.string().min(2),
  location: merchantLocationSchema,
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterPublicMerchantFormInput = z.infer<typeof registerPublicMerchantFormInputSchema>;

/** Respuesta del backend (contrato abierto hasta alinear con el API). */
export type PublicMerchantRegisterResponse = Record<string, unknown>;
