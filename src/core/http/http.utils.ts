import { ApiError } from "@/types/http.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  token?: string;
}

async function request<TResponse, TBody = unknown>(
  endpoint: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers = {}, token } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: "Error desconocido",
      status: res.status,
    }));
    throw error;
  }

  if (res.status === 204) {
    return undefined as TResponse;
  }

  return res.json() as Promise<TResponse>;
}

export const http = {
  get: <TResponse>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<TResponse>(endpoint, { ...options, method: "GET" }),

  post: <TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: Omit<RequestOptions<TBody>, "method" | "body">) =>
    request<TResponse, TBody>(endpoint, { ...options, method: "POST", body }),

  put: <TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: Omit<RequestOptions<TBody>, "method" | "body">) =>
    request<TResponse, TBody>(endpoint, { ...options, method: "PUT", body }),

  patch: <TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: Omit<RequestOptions<TBody>, "method" | "body">) =>
    request<TResponse, TBody>(endpoint, { ...options, method: "PATCH", body }),

  delete: <TResponse>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<TResponse>(endpoint, { ...options, method: "DELETE" }),
};
