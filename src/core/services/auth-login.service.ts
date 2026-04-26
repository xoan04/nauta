import { apihackPublicClient } from "@/core/services/apihack-public-client";
import {
  loginBodySchema,
  loginResponseSchema,
  type LoginBody,
  type LoginResponse,
} from "@/core/models/auth-login.model";

export async function loginWithEmailPassword(body: LoginBody): Promise<LoginResponse> {
  const parsed = loginBodySchema.parse(body);
  const raw = await apihackPublicClient.post<unknown, LoginBody>("/api/v1/auth/login", parsed);
  return loginResponseSchema.parse(raw);
}
