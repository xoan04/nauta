"use client";

import { useQuery } from "@tanstack/react-query";
import { getEconomicSectorsUseCase } from "@/core/use-cases/master/get-economic-sectors.use-case";

export const economicSectorsQueryKey = ["master", "economic-sectors"] as const;

export function useEconomicSectors() {
  return useQuery({
    queryKey: economicSectorsQueryKey,
    queryFn: () => getEconomicSectorsUseCase(),
  });
}
