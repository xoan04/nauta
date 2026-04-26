import { HttpError } from "@/core/http";
import type {
  UpdateMerchantProductInput,
  UpdateMerchantProductResponse,
} from "@/core/models/merchant-update-product.model";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveApihackBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

export async function updateMerchantProduct(
  token: string,
  productId: string,
  input: UpdateMerchantProductInput,
): Promise<UpdateMerchantProductResponse> {
  const form = new FormData();
  form.append("name", input.name);
  form.append("description", input.description ?? "");
  form.append("price", input.price);
  for (const photo of input.photos ?? []) {
    form.append("photos", photo);
  }

  const response = await fetch(`${resolveApihackBaseUrl()}/api/v1/merchant/products/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload: unknown = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (typeof payload === "object" && payload && "message" in payload) {
      const message = (payload as { message?: unknown }).message;
      throw new HttpError(response.status, typeof message === "string" ? message : "No se pudo actualizar el producto");
    }
    if (typeof payload === "string" && payload.trim()) {
      throw new HttpError(response.status, payload);
    }
    throw new HttpError(response.status, "No se pudo actualizar el producto");
  }

  if (payload && typeof payload === "object") {
    return payload as UpdateMerchantProductResponse;
  }

  return {};
}
