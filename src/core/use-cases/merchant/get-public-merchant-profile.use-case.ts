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

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "recientemente";
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  
  if (diffInMinutes < 1) return "hace unos segundos";
  if (diffInMinutes < 60) return `hace ${diffInMinutes}min`;
  if (diffInHours < 24) return `hace ${diffInHours}h`;
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const isYesterday = 
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
    
  if (isYesterday) return "ayer";
  
  return new Intl.DateTimeFormat("es-CO", { 
    day: "numeric", 
    month: "long", 
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric" 
  }).format(date);
}

export async function getPublicMerchantProfileUseCase(userId: string): Promise<MerchantProfileData> {
  const data = await fetchPublicMerchantDetail(userId);
  const firstBusiness = data.businesses[0];
  const businessDetails = firstBusiness?.business;
  
  const businessName = businessDetails?.business_name?.trim();
  const displayName = businessName && businessName.length > 0 ? businessName : data.user.name;
  const handleBase = data.user.email.split("@")[0] || displayName || data.user.id;
  
  const location =
    firstBusiness?.municipality?.name ??
    data.profile_merchant?.municipality_name ??
    "Ubicación no disponible";
    
  const businessDescription = businessDetails?.description?.trim() || "";
  const bio =
    businessDescription.length > 0
      ? businessDescription
      : "Comercio registrado en Perlapp. Próximamente más información de este perfil.";

  const lat = data.profile_merchant?.latitude;
  const lng = data.profile_merchant?.longitude;
  const coords = lat != null && lng != null ? `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}` : null;
  const phone = data.profile_merchant?.phone?.trim() || null;
  const infoExtra = [phone ? `Teléfono: ${phone}` : null, coords].filter(Boolean).join(" · ");

  // Mapeo de publicaciones (posts)
  const mappedPosts = data.posts.map((post) => {
    const primaryPhoto = post.photos.slice().sort((a, b) => a.order - b.order)[0];
    return {
      id: post.id,
      body: post.content,
      publicationTypeId: post.publication_type_id,
      imageUrl: primaryPhoto?.url,
      timeAgo: formatRelativeTime(post.created_at),
      url: (post as Record<string, unknown>).url as string | undefined,
      stats: {
        comments: 0,
        reposts: 0,
        likes: post.likes || 0,
        views: "0",
      },
    };
  });

  // Mapeo de productos
  const mappedProducts = data.products.map((p) => {
    const primaryPhoto = p.photos.slice().sort((a, b) => a.order - b.order)[0];
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: primaryPhoto?.photo ?? "",
    };
  });

  return {
    id: data.user.id,
    slug: slugify(displayName) || data.user.id,
    businessPhone: phone,
    displayName,
    handle: `@${slugify(handleBase) || data.user.id}`,
    categoryLabel: firstBusiness?.business_category?.name ?? "General",
    bio,
    bannerUrl: "/logo.png",
    avatarUrl: data.profile_merchant?.photo || "/logo.png",
    location,
    joinedLabel: formatJoinedLabel(data.user.created_at),
    verified: Boolean(businessDetails?.is_verified),
    posts: mappedPosts,
    products: mappedProducts,
    infoExtra: infoExtra || undefined,
  };
}
