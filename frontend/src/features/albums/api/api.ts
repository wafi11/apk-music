import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/contants";
import { api } from "@/lib/api";
import { API_RESPONSE, ApiPagination } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Album, AlbumDetails } from "../types";

export async function createAlbum(id: string): Promise<string> {
  const req = await api.post<API_RESPONSE<null>>("/album", { albumId: id });
  return req.data.message;
}

export async function findAlbumById(id: number): Promise<AlbumDetails> {
  const req = await api.get<API_RESPONSE<AlbumDetails>>(`/album/${id}`);
  return req.data.data;
}

export async function findAllAlbums(
  limit: number,
  page: number,
  search?: string,
): Promise<ApiPagination<Album[]>> {
  const url = new URLSearchParams();
  url.append("limit", limit.toString());
  url.append("page", page.toString());
  if (search) {
    url.append("search", search.toString());
  }
  const req = await api.get<ApiPagination<Album[]>>(`/album?${url.toString()}`);
  return req.data;
}

export function useCreateAlbum() {
  return useMutation({
    mutationKey: ["create-album"],
    mutationFn: (id: string) => createAlbum(id),
  });
}

export function useFindAllAlbums(limit: number, page: number, search?: string) {
  const req = {
    limit,
    page,
    search,
  };
  return useQuery({
    queryKey: ["albums", req],
    queryFn: () => findAllAlbums(req.limit, req.page, req.search),
    gcTime: DEFAULT_GC_TIME,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useFindAlbumById(id: number) {
  return useQuery({
    queryKey: ["albums-details", id],
    queryFn: () => findAlbumById(id),
    gcTime: DEFAULT_GC_TIME,
    staleTime: DEFAULT_STALE_TIME,
    enabled: !!id,
  });
}
