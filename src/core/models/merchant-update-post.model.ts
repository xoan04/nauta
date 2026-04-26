import { z } from "zod";

export const updateMerchantPostInputSchema = z.object({
  content: z.string().min(1, "El contenido es obligatorio"),
  publication_type_id: z.string().min(1, "La categoría es obligatoria"),
  photos: z.array(z.instanceof(File)).default([]),
});

export type UpdateMerchantPostInput = z.infer<typeof updateMerchantPostInputSchema>;
export type UpdateMerchantPostResponse = Record<string, unknown>;
