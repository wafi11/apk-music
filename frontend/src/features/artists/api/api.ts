import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/contants";
import { Music } from "@/features/songs/types";
import { api } from "@/lib/api";
import { API_RESPONSE } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type Artists = {
  artistId: number;
  artistName: string;
  artistImage: string;
};
export type AlbumsWithSongs = {
  artist: string;
  id: number;
  name: string;
  image: string;
  music: Music[];
};

type ArtistDetails = {
  details: Artists;
  albums: AlbumsWithSongs[];
};

export async function FindAllArtist(
  limit: number,
): Promise<API_RESPONSE<Artists[]>> {
  const data = await api.get<API_RESPONSE<Artists[]>>(`/artist?limit=${limit}`);
  return data.data;
}
export async function findArtistDetails(
  id: number,
): Promise<API_RESPONSE<ArtistDetails>> {
  const data = await api.get<API_RESPONSE<ArtistDetails>>(`/artist/${id}`);
  return data.data;
}

export function useFindAllArtist(limit: number) {
  return useQuery<API_RESPONSE<Artists[]>>({
    queryKey: ["artist-limit", limit],
    queryFn: () => FindAllArtist(limit),
    gcTime: DEFAULT_GC_TIME,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useFindArtistDetails(id: number) {
  return useQuery<API_RESPONSE<ArtistDetails>>({
    queryKey: ["artist", id],
    queryFn: () => findArtistDetails(id),
    gcTime: DEFAULT_GC_TIME,
    staleTime: DEFAULT_STALE_TIME,
    enabled: !!id,
  });
}
