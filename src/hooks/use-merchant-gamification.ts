import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { fetchOnboardingState } from "@/core/services/merchant-gamification.service";

export const merchantGamificationQueryKey = ["merchant-gamification"] as const;

export function useMerchantGamification() {
  const token = useAuthStore((s) => s.token);
  const role = usePerlappRoleStore((s) => s.role);

  return useQuery({
    queryKey: [...merchantGamificationQueryKey, token],
    queryFn: () => fetchOnboardingState(token!),
    enabled: role === "market" && !!token,
    staleTime: 30_000,
  });
}
