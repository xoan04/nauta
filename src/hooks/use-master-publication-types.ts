"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicationTypesMasterUseCase } from "@/core/use-cases/master/get-publication-types-master.use-case";

export const publicationTypesMasterQueryKey = ["master", "publication-types"] as const;

export function useMasterPublicationTypes() {
  return useQuery({
    queryKey: publicationTypesMasterQueryKey,
    queryFn: () => getPublicationTypesMasterUseCase(),
  });
}
