"use client";

import { useQuery } from "@tanstack/react-query";
import { HttpError } from "@/core/http";
import { getPublicMerchantProfileUseCase } from "@/core/use-cases/merchant/get-public-merchant-profile.use-case";
import MerchantNotFound from "@/app/(public)/merchant/[id]/not-found";
import { MerchantProfileView } from "@/components/merchant/MerchantProfileView";

type MerchantProfilePageClientProps = {
  userId: string;
};

export function MerchantProfilePageClient({ userId }: MerchantProfilePageClientProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["merchant-public-profile", userId],
    queryFn: () => getPublicMerchantProfileUseCase(userId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-perlapp-canvas text-perlapp-inkMuted">
        Cargando perfil…
      </div>
    );
  }

  if (isError) {
    if (error instanceof HttpError && error.status === 404) {
      return <MerchantNotFound />;
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-perlapp-canvas px-6 text-center text-perlapp-inkMuted">
        No se pudo cargar el perfil del comercio. Intenta de nuevo.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-perlapp-canvas px-6 text-center text-perlapp-inkMuted">
        No hay datos disponibles para este comercio.
      </div>
    );
  }

  return <MerchantProfileView merchant={data} />;
}
