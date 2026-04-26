import { HttpError } from "@/core/http";
import { gamificationSchema, type Gamification } from "@/core/models/merchant-my-profile.model";

const DEFAULT_BASE = "https://apihack.kodelabs.dev";

function resolveBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APIHACK_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_BASE;
}

async function parseError(res: Response): Promise<HttpError> {
  let message = res.statusText || "Error en la solicitud";
  try {
    const json = (await res.json()) as { message?: string };
    if (typeof json.message === "string" && json.message.trim()) message = json.message;
  } catch {
    // noop
  }
  return new HttpError({ status: res.status, message });
}

export async function fetchOnboardingState(token: string): Promise<Gamification> {
  const res = await fetch(`${resolveBase()}/api/v1/merchant/profile`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw await parseError(res);
  const json = (await res.json()) as { gamification?: unknown };
  return gamificationSchema.parse(json.gamification);
}

export type Stage1Input = {
  business_name: string;
  works_alone: boolean;
  identification_type: string;
  identification_number: string;
  photo?: File | null;
  photo_banner?: File | null;
};

export async function completeStage1(data: Stage1Input, token: string): Promise<void> {
  const fd = new FormData();
  fd.append("business_name", data.business_name);
  fd.append("works_alone", String(data.works_alone));
  fd.append("identification_type", data.identification_type);
  fd.append("identification_number", data.identification_number);
  if (data.photo) fd.append("photo", data.photo);
  if (data.photo_banner) fd.append("photo_banner", data.photo_banner);

  const res = await fetch(`${resolveBase()}/api/v1/merchant/businesses/onboarding/stages/1`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    body: fd,
  });
  if (!res.ok) throw await parseError(res);
}

export type Stage2Input = {
  activity_description: string;
  economic_sector_ids: string[];
};

export async function completeStage2(data: Stage2Input, token: string): Promise<void> {
  const res = await fetch(`${resolveBase()}/api/v1/merchant/businesses/onboarding/stages/2`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      activity_description: data.activity_description,
      economic_sector_ids: data.economic_sector_ids,
      ciiu_code: "",
    }),
  });
  if (!res.ok) throw await parseError(res);
}

export type Stage3Input = {
  municipality_id: string;
  business_address: string;
};

export async function completeStage3(data: Stage3Input, token: string): Promise<void> {
  const res = await fetch(`${resolveBase()}/api/v1/merchant/businesses/onboarding/stages/3`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await parseError(res);
}

export type Stage4Input = {
  total_assets_value: number;
  annual_revenue: number;
  employee_count: number;
};

export async function completeStage4(data: Stage4Input, token: string): Promise<void> {
  const res = await fetch(`${resolveBase()}/api/v1/merchant/businesses/onboarding/stages/4`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await parseError(res);
}

export type Stage5Input = {
  contact_phone: string;
  contact_email: string;
  wants_sales_or_financing_support: boolean;
};

export async function completeStage5(data: Stage5Input, token: string): Promise<void> {
  const res = await fetch(`${resolveBase()}/api/v1/merchant/businesses/onboarding/stages/5`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await parseError(res);
}

export type EconomicSector = { id: string; name: string; code: string };

export async function fetchEconomicSectors(token: string): Promise<EconomicSector[]> {
  const res = await fetch(`${resolveBase()}/api/v1/economic-sectors`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw await parseError(res);
  const json = (await res.json()) as unknown;
  if (Array.isArray(json)) return json as EconomicSector[];
  if (json && typeof json === "object" && "data" in json) return (json as { data: EconomicSector[] }).data;
  return [];
}

export type Municipality = { id: string; name: string; code: string };

export async function fetchMunicipalities(): Promise<Municipality[]> {
  const res = await fetch(`${resolveBase()}/api/v1/municipalities`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw await parseError(res);
  const json = (await res.json()) as unknown;
  if (Array.isArray(json)) return json as Municipality[];
  if (json && typeof json === "object" && "data" in json) return (json as { data: Municipality[] }).data;
  return [];
}
