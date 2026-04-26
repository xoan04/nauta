import { HttpError } from "@/core/http";
import type {
  UpdateMerchantPostInput,
  UpdateMerchantPostResponse,
} from "@/core/models/merchant-update-post.model";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveApihackBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

export async function updateMerchantPost(
  token: string,
  postId: string,
  input: UpdateMerchantPostInput
): Promise<UpdateMerchantPostResponse> {
  const formData = new FormData();
  formData.append("content", input.content);
  formData.append("publication_type_id", input.publication_type_id);
  for (const photo of input.photos) {
    formData.append("photos", photo);
  }

  const response = await fetch(`${resolveApihackBaseUrl()}/api/v1/merchant/posts/${postId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = response.statusText || "Error al actualizar la publicación";
    try {
      const errorJson = (await response.json()) as { message?: string };
      if (typeof errorJson.message === "string" && errorJson.message.trim()) {
        message = errorJson.message;
      }
    } catch {
      // noop
    }
    throw new HttpError({ status: response.status, message });
  }

  try {
    const raw = (await response.json()) as unknown;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      return { ...(raw as Record<string, unknown>) };
    }
    return {};
  } catch {
    return {};
  }
}
