import {
  type CreateMerchantPostInput,
  type CreateMerchantPostResponse,
} from "@/core/models/merchant-create-post.model";
import { HttpError } from "@/core/http";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveApihackBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

/**
 * Crea una publicación del merchant autenticado.
 * POST `/api/v1/merchant/posts` en multipart/form-data.
 */
export async function createMerchantPost(
  input: CreateMerchantPostInput,
  token: string
): Promise<CreateMerchantPostResponse> {
  const formData = new FormData();
  formData.append("content", input.content);
  formData.append("publication_type_id", input.publication_type_id);
  for (const photo of input.photos) {
    formData.append("photos", photo);
  }

  const response = await fetch(`${resolveApihackBaseUrl()}/api/v1/merchant/posts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = response.statusText || "Error al crear la publicación";
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

type ImproveDescriptionResponse = {
  improved_description?: string;
};

/**
 * Mejora la descripción de una publicación con IA usando imagen + descripción opcional.
 * POST `/api/v1/merchant/posts/improve-description` en multipart/form-data.
 */
export async function improveMerchantPostDescription(
  input: { image: File; description?: string },
  token: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", input.image);
  if (typeof input.description === "string" && input.description.trim()) {
    formData.append("description", input.description.trim());
  }

  const response = await fetch(`${resolveApihackBaseUrl()}/api/v1/merchant/posts/improve-description`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = response.statusText || "Error al mejorar la descripción";
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

  const raw = (await response.json()) as ImproveDescriptionResponse;
  return typeof raw.improved_description === "string" ? raw.improved_description : "";
}
