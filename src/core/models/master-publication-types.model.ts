import { z } from "zod";

export const publicationTypeSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const publicationTypesResponseSchema = z.object({
  publication_types: z.array(publicationTypeSchema),
  total: z.number(),
});

export type PublicationType = z.infer<typeof publicationTypeSchema>;
export type PublicationTypesResponse = z.infer<typeof publicationTypesResponseSchema>;
