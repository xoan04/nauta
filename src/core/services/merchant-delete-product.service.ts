import { HttpError } from "@/core/http";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveApihackBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

export async function deleteMerchantProduct(token: string, productId: string): Promise<void> {
  const response = await fetch(`${resolveApihackBaseUrl()}/api/v1/merchant/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const payload: unknown = contentType.includes("application/json") ? await response.json() : await response.text();
    if (typeof payload === "object" && payload && "message" in payload) {
      const message = (payload as { message?: unknown }).message;
      throw new HttpError(response.status, typeof message === "string" ? message : "No se pudo eliminar el producto");
    }
    if (typeof payload === "string" && payload.trim()) {
      throw new HttpError(response.status, payload);
    }
    throw new HttpError(response.status, "No se pudo eliminar el producto");
  }
}
