import type { MerchantProfileData } from "@/lib/merchant-profile.types";
import { fetchMerchantMyProfile } from "@/core/services/merchant-my-profile.service";

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

export type MyMerchantProfileData = {
  userId: string;
  profile: MerchantProfileData;
};

export async function getMyMerchantProfileUseCase(token: string): Promise<MyMerchantProfileData> {
  const data = await fetchMerchantMyProfile(token);
  const displayName = data.user.name.trim().length > 0 ? data.user.name : "Mi comercio";
  const handleBase = data.user.email.split("@")[0] || displayName || data.user.id;
  const lat = data.profile_merchant?.latitude;
  const lng = data.profile_merchant?.longitude;
  const coords = lat != null && lng != null ? `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}` : null;

  return {
    userId: data.user.id,
    profile: {
      id: data.user.id,
      slug: slugify(displayName) || data.user.id,
      displayName,
      handle: `@${slugify(handleBase) || data.user.id}`,
      categoryLabel: "Tu perfil de comercio",
      bio: "Gestiona tu perfil público de comercio en Perlapp.",
      bannerUrl: "/logo.png",
      avatarUrl: "/logo.png",
      location: "Ubicación registrada",
      websiteLabel: "perlapp.app",
      websiteHref: "https://perlapp.app",
      joinedLabel: formatJoinedLabel(data.user.created_at),
      followingCount: "0",
      followersCount: "0",
      verified: false,
      posts: [],
      infoExtra: coords || undefined,
    },
  };
}
