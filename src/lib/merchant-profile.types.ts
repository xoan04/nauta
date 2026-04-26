import type { ProfileCatalogProduct } from "./merchant-catalog.types";

export type MerchantPost = {
  id: string;
  body: string;
  publicationTypeId?: string;
  imageUrl?: string;
  imageAlt?: string;
  timeAgo: string;
  stats: {
    comments: number;
    reposts: number;
    likes: number;
    views: string;
  };
};

export type MerchantProfileData = {
  id: string;
  slug: string;
  displayName: string;
  handle: string;
  categoryLabel: string;
  bio: string;
  bannerUrl: string;
  avatarUrl: string;
  location: string;
  websiteLabel?: string;
  websiteHref?: string;
  joinedLabel: string;
  followingCount?: string;
  followersCount?: string;
  verified: boolean;
  posts: MerchantPost[];
  products: ProfileCatalogProduct[];
  /** Texto extra en pestaña Información */
  infoExtra?: string;
};
