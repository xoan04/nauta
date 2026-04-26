import { feedResponseSchema, type FeedResponse } from "@/core/models/feed.model";
import { apihackPublicClient } from "@/core/services/apihack-public-client";
import type { PerlappRole } from "@/types/perlapp-role.types";

export async function fetchFeed(
  role: PerlappRole,
  token: string | null | undefined,
  page = 1,
  pageSize = 10
): Promise<FeedResponse> {
  const endpoint = role === "market" ? "/api/v1/merchant/feed" : "/api/v1/feed";

  const raw = await apihackPublicClient.get<unknown>(endpoint, {
    token: token ?? undefined,
    params: { page, page_size: pageSize },
  });
  return feedResponseSchema.parse(raw);
}
