import { z } from "zod";

export const economicSectorSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  display_order: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const economicSectorsResponseSchema = z.object({
  sectors: z.array(economicSectorSchema),
  total: z.number(),
});

export type EconomicSector = z.infer<typeof economicSectorSchema>;
export type EconomicSectorsResponse = z.infer<typeof economicSectorsResponseSchema>;
