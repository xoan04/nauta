import { z } from "zod";

export const createMerchantPostInputSchema = z.object({
  content: z.string().min(1, "El contenido es obligatorio"),
  publication_type_id: z.string().min(1, "Selecciona una categoría"),
  photos: z.array(z.instanceof(File)).default([]),
});

export type CreateMerchantPostInput = z.infer<typeof createMerchantPostInputSchema>;

export type CreateMerchantPostResponse = Record<string, unknown>;
