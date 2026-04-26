import type { MerchantProfileData } from "@/lib/merchant-profile.types";
import { fetchPublicMerchantDetail } from "@/core/services/merchant-public-detail.service";

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function formatJoinedLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Se unió recientemente";
  const label = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(d);
  return `Se unió en ${label}`;
}

export async function getPublicMerchantProfileUseCase(userId: string): Promise<MerchantProfileData> {
  const data = await fetchPublicMerchantDetail(userId);
  const firstBusiness = data.businesses[0];
  const businessName = firstBusiness?.business.nombre?.trim();
  const displayName = businessName && businessName.length > 0 ? businessName : data.user.name;
  const handleBase = data.user.email.split("@")[0] || displayName || data.user.id;
  const location =
    firstBusiness?.municipality?.name ??
    data.profile_merchant?.municipality_name ??
    "Ubicación no disponible";
  const description = firstBusiness?.business.descripcion?.trim() || "";
  const bio =
    description.length > 0
      ? description
      : "Comercio registrado en Perlapp. Próximamente más información de este perfil.";

  const lat = data.profile_merchant?.latitude;
  const lng = data.profile_merchant?.longitude;
  const coords = lat != null && lng != null ? `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}` : null;
  const phone = data.profile_merchant?.phone?.trim() || null;
  const infoExtra = [phone ? `Teléfono: ${phone}` : null, coords].filter(Boolean).join(" · ");

  return {
    id: data.user.id,
    slug: slugify(displayName) || data.user.id,
    displayName,
    handle: `@${slugify(handleBase) || data.user.id}`,
    categoryLabel: firstBusiness?.business_category?.name ?? "General",
    bio,
    bannerUrl: "/logo.png",
    avatarUrl: data.profile_merchant?.photo || "/logo.png",
    location,
    websiteLabel: "perlapp.app",
    websiteHref: "https://perlapp.app",
    joinedLabel: formatJoinedLabel(data.user.created_at),
    followingCount: "0",
    followersCount: "0",
    verified: Boolean(firstBusiness?.business.verificado),
    posts: [],
    infoExtra: infoExtra || undefined,
  };
}
