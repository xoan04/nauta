import { z } from "zod";

export const updateMerchantProductInputSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional().default(""),
  price: z.string().min(1, "El precio es obligatorio"),
  photos: z.array(z.instanceof(File)).default([]),
});

export type UpdateMerchantProductInput = z.infer<typeof updateMerchantProductInputSchema>;
export type UpdateMerchantProductResponse = Record<string, unknown>;
