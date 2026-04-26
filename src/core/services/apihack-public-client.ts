import { createHttpClient } from "@/core/http/http-client";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveApihackBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

/** Cliente HTTP para rutas públicas bajo `NEXT_PUBLIC_APIHACK_BASE_URL`. */
export const apihackPublicClient = createHttpClient({
  baseUrl: resolveApihackBaseUrl(),
  timeoutMs: 30_000,
});
