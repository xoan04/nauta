import type { EconomicSectorsResponse } from "@/core/models/economic-sector.model";
import { fetchEconomicSectors } from "@/core/services/master/economic-sectors.service";

export async function getEconomicSectorsUseCase(): Promise<EconomicSectorsResponse> {
  return fetchEconomicSectors();
}
