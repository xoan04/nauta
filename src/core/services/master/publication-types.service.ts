import {
  publicationTypesResponseSchema,
  type PublicationTypesResponse,
} from "@/core/models/master-publication-types.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

/**
 * Tabla maestra de tipos de publicación.
 * GET `/api/v1/publication-types`
 */
export async function fetchPublicationTypesMaster(): Promise<PublicationTypesResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/publication-types");
  return publicationTypesResponseSchema.parse(raw);
}
