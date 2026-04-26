import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedMerchants } from "@/core/services/featured-merchants.service";
import { useAuthStore } from "@/store/auth.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

export function useFeaturedMerchants() {
  const role = usePerlappRoleStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["featured-merchants", role],
    queryFn: () => fetchFeaturedMerchants(role as "market" | "comprador", token!),
    enabled: role !== "invitado" && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
