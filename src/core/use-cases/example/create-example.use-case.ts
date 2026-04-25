import { createExample } from "@/core/services/example.service";
import { createExampleInputSchema } from "@/core/models/example.model";
import type { CreateExampleInput, Example } from "@/core/models/example.model";

/**
 * Valida el input con Zod antes de enviar; delega al service.
 */
export async function createExampleUseCase(
  input: CreateExampleInput,
  params: { token?: string } = {}
): Promise<Example> {
  const parsed = createExampleInputSchema.parse(input);
  return createExample(parsed, params.token);
}
