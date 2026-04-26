import { loginBodySchema } from "@/core/models/auth-login.model";
import type { LoginBody, LoginResponse } from "@/core/models/auth-login.model";
import { loginWithEmailPassword } from "@/core/services/auth-login.service";

export async function loginUseCase(input: LoginBody): Promise<LoginResponse> {
  const body = loginBodySchema.parse(input);
  return loginWithEmailPassword(body);
}
