import {
  merchantMyProfileResponseSchema,
  type MerchantMyProfileResponse,
} from "@/core/models/merchant-my-profile.model";
import { HttpError } from "@/core/http";
import { apihackPublicClient } from "@/core/services/apihack-public-client";

function resolveBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "https://apihack.kodelabs.dev";
}

async function parsePutProfileError(res: Response): Promise<HttpError> {
  let message = res.statusText || "Error al actualizar el perfil";
  try {
    const json = (await res.json()) as { message?: string };
    if (typeof json.message === "string" && json.message.trim()) message = json.message;
  } catch {
    // noop
  }
  return new HttpError({ status: res.status, message });
}

/**
 * Perfil del comerciante autenticado.
 * GET `/api/v1/merchant/profile`
 */
export async function fetchMerchantMyProfile(token: string): Promise<MerchantMyProfileResponse> {
  const raw = await apihackPublicClient.get<unknown>("/api/v1/merchant/profile", { token });
  return merchantMyProfileResponseSchema.parse(raw);
}

/**
 * Actualiza el teléfono del perfil merchant (`PUT /api/v1/merchant/profile`, multipart).
 * Reenvía nombre y coordenadas actuales para no vaciar campos que el API exija.
 */
export async function updateMerchantProfileMerchantPhone(token: string, phone: string): Promise<void> {
  const trimmed = phone.trim();
  if (!trimmed) {
    throw new Error("Introduce un número de teléfono.");
  }

  const current = await fetchMerchantMyProfile(token);
  const fd = new FormData();
  fd.append("name", current.user.name);
  fd.append("phone", trimmed);
  const pm = current.profile_merchant;
  if (pm) {
    if (pm.latitude != null) fd.append("latitude", String(pm.latitude));
    if (pm.longitude != null) fd.append("longitude", String(pm.longitude));
    const mid = pm.municipality_id?.trim();
    if (mid) fd.append("municipality_id", mid);
  }

  const res = await fetch(`${resolveBase()}/api/v1/merchant/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) throw await parsePutProfileError(res);
}
