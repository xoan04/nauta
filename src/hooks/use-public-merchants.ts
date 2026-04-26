import { useQuery } from "@tanstack/react-query";
import { listPublicMerchantsUseCase } from "@/core/use-cases/merchant/list-public-merchants.use-case";

export const publicMerchantsQueryKey = ["public-merchants"] as const;

export function usePublicMerchants() {
  return useQuery({
    queryKey: publicMerchantsQueryKey,
    queryFn: () => listPublicMerchantsUseCase(),
  });
}
