import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/core/services/feed.service";
import { useAuthStore } from "@/store/auth.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

export function useFeed() {
  const role = usePerlappRoleStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  return useInfiniteQuery({
    queryKey: ["feed", role],
    queryFn: ({ pageParam }) => fetchFeed(role, token, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
