import type { ApiError } from "@/types/http.types";

export type HttpClientConfig = {
  /** URL base (ej. `https://api.tudominio.com`). Sin barra final. */
  baseUrl: string;
  /** Cabeceras adicionales en todas las peticiones. */
  defaultHeaders?: Record<string, string>;
  /** Token por defecto; se ignora si la petición pasa `token` explícito. */
  getToken?: () => string | null | undefined;
  /** Tiempo máximo de espera en ms (usa `AbortSignal.timeout`). */
  timeoutMs?: number;
};

export type HttpRequestOptions = {
  headers?: Record<string, string>;
  /** Sustituye al token de `getToken` para esta petición. */
  token?: string;
  /** Query string (omitir claves con `undefined` / `null`). */
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpRequestInit<TBody = unknown> = HttpRequestOptions & {
  method?: HttpMethod;
  body?: TBody;
};

function joinBaseUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

function appendQuery(
  url: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params || Object.keys(params).length === 0) return url;

  const entries = Object.entries(params).filter(
    (e): e is [string, string | number | boolean] =>
      e[1] !== undefined && e[1] !== null
  );
  if (entries.length === 0) return url;

  if (/^https?:\/\//i.test(url)) {
    const u = new URL(url);
    for (const [key, value] of entries) {
      u.searchParams.set(key, String(value));
    }
    return u.toString();
  }

  const sp = new URLSearchParams();
  for (const [key, value] of entries) {
    sp.set(key, String(value));
  }
  const qs = sp.toString();
  return url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
}

async function parseErrorPayload(res: Response): Promise<ApiError> {
  const status = res.status;
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json: unknown = await res.json().catch(() => null);
    if (json && typeof json === "object") {
      const o = json as Record<string, unknown>;
      const message =
        typeof o.message === "string" && o.message.length > 0
          ? o.message
          : res.statusText || "Error en la solicitud";
      const errors = o.errors;
      return {
        message,
        status,
        errors:
          errors && typeof errors === "object" && !Array.isArray(errors)
            ? (errors as Record<string, string | string[]>)
            : undefined,
      };
    }
  }

  const text = (await res.text().catch(() => "")).trim();
  return {
    message: text.length > 0 ? text : res.statusText || "Error en la solicitud",
    status,
  };
}

export class HttpError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string | string[]>;

  constructor(payload: ApiError) {
    super(payload.message);
    this.name = "HttpError";
    this.status = payload.status;
    this.errors = payload.errors;
  }
}

export function createHttpClient(config: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}

export class HttpClient {
  constructor(private readonly config: HttpClientConfig) {}

  private buildSignal(options?: HttpRequestOptions): AbortSignal | undefined {
    const user = options?.signal;
    const ms = this.config.timeoutMs;
    if (ms == null || ms <= 0) return user;
    const timeout = AbortSignal.timeout(ms);
    if (!user) return timeout;
    return AbortSignal.any([user, timeout]);
  }

  private authHeader(options?: HttpRequestOptions): Record<string, string> {
    const token = (options?.token ?? this.config.getToken?.() ?? "").trim();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  async request<TResponse, TBody = unknown>(
    endpoint: string,
    options: HttpRequestInit<TBody> = {}
  ): Promise<TResponse> {
    const { method = "GET", body, headers = {}, params, ...rest } = options;
    const pathWithQuery = appendQuery(joinBaseUrl(this.config.baseUrl, endpoint), params);

    const finalHeaders: Record<string, string> = {
      Accept: "application/json",
      ...this.config.defaultHeaders,
      ...headers,
      ...this.authHeader(rest),
    };

    const hasBody = body !== undefined && body !== null && method !== "GET" && method !== "DELETE";
    if (hasBody && !finalHeaders["Content-Type"]) {
      finalHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(pathWithQuery, {
      method,
      headers: finalHeaders,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: this.buildSignal(rest),
    });

    if (!res.ok) {
      const payload = await parseErrorPayload(res);
      throw new HttpError(payload);
    }

    if (res.status === 204) {
      return undefined as TResponse;
    }

    const ct = res.headers.get("content-type") ?? "";
    const raw = await res.text();
    if (!raw.trim()) {
      return undefined as TResponse;
    }

    if (!ct.includes("application/json")) {
      return raw as TResponse;
    }

    try {
      return JSON.parse(raw) as TResponse;
    } catch {
      return raw as TResponse;
    }
  }

  get<TResponse>(endpoint: string, options?: HttpRequestOptions): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...options, method: "GET" });
  }

  post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: HttpRequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(endpoint, { ...options, method: "POST", body });
  }

  put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: HttpRequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(endpoint, { ...options, method: "PUT", body });
  }

  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: HttpRequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<TResponse>(endpoint: string, options?: HttpRequestOptions): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...options, method: "DELETE" });
  }
}
