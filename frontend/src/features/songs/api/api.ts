import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/contants";
import { api } from "@/lib/api";
import {
  API_RESPONSE,
  ApiPagination,
  CursorPagination,
  CursorRequest,
} from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Music, PostSong, QueryRequestParams, SearchMusic } from "../types";

// fetching
export async function createSongs(request: PostSong): Promise<string> {
  const req = await api.post<API_RESPONSE<null>>("/song", request);
  return req.data.message;
}
export async function searchMusic(
  request: CursorRequest,
): Promise<CursorPagination<SearchMusic[]>> {
  const url = new URLSearchParams();
  if (request.cursor) {
    url.append("cursor", request.cursor.toString());
  }
  if (request.search) {
    url.append("query", request.search.toString());
  }
  const req = await api.get<API_RESPONSE<CursorPagination<SearchMusic[]>>>(
    `/song/search?${url.toString()}`,
  );
  return req.data.data;
}

export async function updateSongs(request: number): Promise<string> {
  const req = await api.patch<API_RESPONSE<string>>(`/song/${request}/url-yt`);
  return req.data.data;
}

export async function findAllSongs(request: QueryRequestParams) {
  const url = new URLSearchParams();
  url.append("limit", request.limit.toString());
  url.append("page", request.page.toString());
  if (request.search) {
    url.append("search", request.search.toString());
  }
  const req = await api.get<ApiPagination<Music[]>>(`/song?${url.toString()}`);
  return req.data.data;
}

export function useCreatePost() {
  return useMutation({
    mutationKey: ["song"],
    mutationFn: (req: PostSong) => createSongs(req),
  });
}

export function useSearchMusic(search: string) {
  return useInfiniteQuery<CursorPagination<SearchMusic[]>>({
    queryKey: ["search-song", search],
    queryFn: ({ pageParam }) => {
      return searchMusic({
        cursor: pageParam as string,
        search,
      });
    },
    enabled: !!search,
    getNextPageParam: (lastPage) => {
      return lastPage.metadata.hasMore
        ? lastPage.metadata.nextCursor
        : undefined;
    },
    initialPageParam: undefined,
  });
}

export function useUpdateSong(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["song", id],
    mutationFn: () => updateSongs(id),
    onSuccess: () => {
      toast.success("Successfullt update song");
      const request = {
        limit: 10,
        page: 1,
      };
      queryClient.invalidateQueries({
        queryKey: ["songs-with-pagination", request],
      });
    },
  });
}

export function useAllSongs(request: QueryRequestParams) {
  return useQuery({
    queryKey: ["songs-with-pagination", request],
    queryFn: () => findAllSongs(request),
    gcTime: DEFAULT_GC_TIME,
    staleTime: DEFAULT_STALE_TIME,
  });
}
