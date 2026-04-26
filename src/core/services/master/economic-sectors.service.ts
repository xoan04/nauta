import {
  economicSectorsResponseSchema,
  type EconomicSectorsResponse,
} from "@/core/models/economic-sector.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Tabla maestra de sectores económicos (categorías).
 * GET `/api/v1/economic-sectors`
 */
export async function fetchEconomicSectors(): Promise<EconomicSectorsResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/economic-sectors");
  return economicSectorsResponseSchema.parse(raw);
}
