import {
  publicMerchantRegisterBodySchema,
  registerPublicMerchantFormInputSchema,
  type RegisterPublicMerchantFormInput,
  type PublicMerchantRegisterResponse,
} from "@/core/models/merchant-public-registration.model";
import { registerPublicMerchant } from "@/core/services/merchant-public-registration.service";

/**
 * Valida el formulario, mapea a la forma del API y registra el comerciante.
 */
export async function registerPublicMerchantUseCase(
  input: RegisterPublicMerchantFormInput
): Promise<PublicMerchantRegisterResponse> {
  const form = registerPublicMerchantFormInputSchema.parse(input);
  const body = publicMerchantRegisterBodySchema.parse({
    email: form.email.trim(),
    password: form.password,
    name: form.businessName.trim(),
    latitude: form.location.lat,
    longitude: form.location.lng,
  });
  return registerPublicMerchant(body);
}
