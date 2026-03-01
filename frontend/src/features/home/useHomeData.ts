import { useAlbums } from "../albums";
import { useArtists } from "../artists/api";
import { useSongs } from "../songs/api/api";

export function useHomeData() {
  const songs = useSongs();
  const albums = useAlbums();
  const artists = useArtists();

  return { songs, albums, artists };
}
