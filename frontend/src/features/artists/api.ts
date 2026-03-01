import { api } from "@/lib/api";
import { ApiResponse, CursorResponse } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Artists } from "./types";

export function useArtists(search?: string) {
  return useInfiniteQuery({
    queryKey: ["artists", search],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam);
      if (search) params.set("search", search);

      const res = await api.get<ApiResponse<CursorResponse<Artists>>>(
        `/artists?${params.toString()}`,
      );
      return res.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? null,
  });
}
