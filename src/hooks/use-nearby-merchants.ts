import { useQuery } from "@tanstack/react-query";
import { fetchNearbyMerchants } from "@/core/services/nearby-merchants.service";
import { useAuthStore } from "@/store/auth.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { useGeolocation } from "./use-geolocation";

export function useNearbyMerchants() {
  const role = usePerlappRoleStore((s) => s.role);
  const token = useAuthStore((s) => s.token);
  const geo = useGeolocation();

  const hasCoords = geo.status === "resolved";
  const lat = hasCoords ? geo.lat : undefined;
  const lng = hasCoords ? geo.lng : undefined;

  return {
    geo,
    ...useQuery({
      queryKey: ["nearby-merchants", role, lat, lng],
      queryFn: () =>
        fetchNearbyMerchants(
          role as "market" | "comprador",
          token!,
          { lat: lat!, lng: lng! }
        ),
      enabled: role !== "invitado" && !!token && hasCoords,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
    }),
  };
}
