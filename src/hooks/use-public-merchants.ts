import { useQuery } from "@tanstack/react-query";
import { listPublicMerchantsUseCase } from "@/core/use-cases/merchant/list-public-merchants.use-case";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { useAuthStore } from "@/store/auth.store";

export const publicMerchantsQueryKey = ["public-merchants"] as const;

export function usePublicMerchants() {
  const role = usePerlappRoleStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: [...publicMerchantsQueryKey, role],
    queryFn: () => listPublicMerchantsUseCase(role, token),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
