import { useQuery } from "@tanstack/react-query";
import { fetchNearbyMerchants } from "@/core/services/nearby-merchants.service";
import { useAuthStore } from "@/store/auth.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

export function useExplorarMerchants(lat?: number, lng?: number) {
  const role = usePerlappRoleStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["explorar-merchants", role, lat, lng],
    queryFn: () =>
      fetchNearbyMerchants(role as "market" | "comprador", token!, {
        lat: lat!,
        lng: lng!,
        radiusKm: 10,
        pageSize: 50,
      }),
    enabled:
      (role === "comprador" || role === "market") &&
      !!token &&
      lat != null &&
      lng != null,
    staleTime: 2 * 60 * 1000,
  });
}
