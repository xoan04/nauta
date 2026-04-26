import { z } from "zod";

/** Cuerpo enviado a `POST /api/v1/public/buyers`. */
export const publicBuyerRegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type PublicBuyerRegisterBody = z.infer<typeof publicBuyerRegisterBodySchema>;

/** Entrada del formulario multi-paso (sin `confirmPassword`). */
export const registerPublicBuyerFormInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterPublicBuyerFormInput = z.infer<typeof registerPublicBuyerFormInputSchema>;

export type PublicBuyerRegisterResponse = Record<string, unknown>;
