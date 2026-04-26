import type { MerchantProfileData } from "@/lib/merchant-profile.types";
import { fetchMerchantMyProfile } from "@/core/services/merchant-my-profile.service";
import { fetchMerchantMyPosts } from "@/core/services/merchant-my-posts.service";

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

function formatPostTimeAgo(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "ahora";
  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))} min`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} h`;
  return `${Math.floor(diffMs / day)} d`;
}

export type MyMerchantProfileData = {
  userId: string;
  profile: MerchantProfileData;
};

export async function getMyMerchantProfileUseCase(token: string): Promise<MyMerchantProfileData> {
  const [data, myPosts] = await Promise.all([
    fetchMerchantMyProfile(token),
    fetchMerchantMyPosts(token),
  ]);
  const displayName = data.user.name.trim().length > 0 ? data.user.name : "Mi comercio";
  const handleBase = data.user.email.split("@")[0] || displayName || data.user.id;
  const lat = data.profile_merchant?.latitude;
  const lng = data.profile_merchant?.longitude;
  const coords = lat != null && lng != null ? `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}` : null;

  const mappedPosts = myPosts.posts.map((post) => {
    const primaryPhoto = post.photos
      .slice()
      .sort((a, b) => a.order - b.order)[0];
    const safeImageUrl = primaryPhoto?.url?.trim();
    return {
      id: post.id,
      body: post.content,
      publicationTypeId: post.publication_type_id ?? undefined,
      imageUrl: safeImageUrl && safeImageUrl.length > 0 ? safeImageUrl : undefined,
      imageAlt: post.publication_type_name ?? "Imagen de publicación",
      timeAgo: formatPostTimeAgo(post.created_at),
      stats: {
        comments: 0,
        reposts: 0,
        likes: post.likes,
        views: "0",
      },
    };
  });

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
      posts: mappedPosts,
      infoExtra: coords || undefined,
    },
  };
}
