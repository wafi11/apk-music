import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { SongResponse } from "../types";

export function useSongs(search?: string) {
  return useInfiniteQuery({
    queryKey: ["songs", search],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam);
      if (search) params.set("search", search);

      const res = await api.get<ApiResponse<SongResponse>>(
        `/songs?${params.toString()}`,
      );
      return res.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? null,
  });
}

export function useLyrics(
  title: string,
  album: string,
  duration: string,
  artist: string,
) {
  return useQuery({
    queryKey: ["lyrics", title, artist],
    queryFn: async () => {
      const req = await api.get<ApiResponse<{ plain: string; synced: string }>>(
        `/songs/lyric?title=${title}&artist=${artist}&album=${album}&duration=${duration}`,
      );
      return req.data.data;
    },
    enabled: !!title && !!artist,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });
}
export function useSongsByAlbum(albumId: string) {
  return useInfiniteQuery({
    queryKey: ["songs-album", albumId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam);

      const res = await api.get<ApiResponse<SongResponse>>(
        `/songs/album/${albumId}?${params.toString()}`,
      );
      return res.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? null,
  });
}

export function useSongsByArtist(artistId: string) {
  return useInfiniteQuery({
    queryKey: ["songs-album", artistId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam);

      const res = await api.get<ApiResponse<SongResponse>>(
        `/songs/artist/${artistId}?${params.toString()}`,
      );
      return res.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? null,
  });
}
