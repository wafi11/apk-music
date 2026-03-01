import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlbumsResponse } from "./album";

export function useAlbums(search?: string) {
  return useInfiniteQuery({
    queryKey: ["albums", search],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam);
      if (search) params.set("search", search);

      const res = await api.get<ApiResponse<AlbumsResponse>>(
        `/albums?${params.toString()}`,
      );
      return res.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? null,
  });
}
