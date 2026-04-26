import { createHttpClient } from "@/core/http/http-client";

/**
 * Cliente HTTP por defecto (`NEXT_PUBLIC_API_URL`).
 * Para otra base URL o cabeceras, usa `createHttpClient` desde `@/core/http/http-client`.
 */
export const http = createHttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
});

export {
  createHttpClient,
  HttpClient,
  HttpError,
  type HttpClientConfig,
  type HttpRequestInit,
  type HttpRequestOptions,
} from "@/core/http/http-client";
