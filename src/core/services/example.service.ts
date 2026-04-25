import { http } from "@/core/http/http.utils";
import {
  createdExampleResponseSchema,
  CreateExampleInput,
  examplesListSchema,
  type Example,
} from "@/core/models/example.model";

/**
 * Mapea endpoints de la API externa. No lógica de negocio.
 * JSONPlaceholder: /posts
 */
export async function getExamplesList(token?: string): Promise<Example[]> {
  const raw = await http.get<unknown>("/posts", { token });
  return examplesListSchema.parse(raw);
}

export async function createExample(
  input: CreateExampleInput,
  token?: string
): Promise<Example> {
  const raw = await http.post<unknown, CreateExampleInput>("/posts", input, { token });
  return createdExampleResponseSchema.parse(raw);
}
