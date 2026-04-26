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
  
  // Round to ~110m to avoid frequent re-fetching due to minor coordinate jitter
  const lat = hasCoords ? Math.round(geo.lat * 1000) / 1000 : undefined;
  const lng = hasCoords ? Math.round(geo.lng * 1000) / 1000 : undefined;

  return {
    geo,
    ...useQuery({
      queryKey: ["nearby-merchants", role, lat, lng],
      queryFn: () =>
        fetchNearbyMerchants(
          role as "market" | "comprador",
          token!,
          { lat: lat!, lng: lng!, pageSize: 5 } // Fetch only 5 merchants as requested
        ),
      enabled: role !== "invitado" && !!token && hasCoords,
      staleTime: 1000 * 60 * 30, // 30 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    }),
  };
}
