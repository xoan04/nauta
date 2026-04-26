import type { PublicationTypesResponse } from "@/core/models/master-publication-types.model";
import { fetchPublicationTypesMaster } from "@/core/services/master/publication-types.service";

export async function getPublicationTypesMasterUseCase(): Promise<PublicationTypesResponse> {
  return fetchPublicationTypesMaster();
}
