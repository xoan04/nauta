import { HttpError } from "@/core/http";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveApihackBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

export async function deleteMerchantPost(token: string, postId: string): Promise<void> {
  const response = await fetch(`${resolveApihackBaseUrl()}/api/v1/merchant/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = response.statusText || "Error al eliminar la publicación";
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
}
