import { getExamplesList } from "@/core/services/example.service";
import type { Example } from "@/core/models/example.model";

/**
 * Orquesta el listado. El service ya valida la respuesta con el schema del modelo.
 */
export async function getExamplesUseCase(params: {
  token?: string;
}): Promise<Example[]> {
  return getExamplesList(params.token);
}
