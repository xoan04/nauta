import {
  publicBuyerRegisterBodySchema,
  registerPublicBuyerFormInputSchema,
  type RegisterPublicBuyerFormInput,
  type PublicBuyerRegisterResponse,
} from "@/core/models/buyer-public-registration.model";
import { registerPublicBuyer } from "@/core/services/buyer-public-registration.service";

/**
 * Valida el formulario, mapea a la forma del API y registra el comprador.
 */
export async function registerPublicBuyerUseCase(
  input: RegisterPublicBuyerFormInput
): Promise<PublicBuyerRegisterResponse> {
  const form = registerPublicBuyerFormInputSchema.parse(input);
  const body = publicBuyerRegisterBodySchema.parse({
    email: form.email.trim(),
    password: form.password,
    name: form.name.trim(),
  });
  return registerPublicBuyer(body);
}
