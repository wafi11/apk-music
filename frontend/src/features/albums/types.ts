import { Music } from "../songs/types";

export type Album = {
  id: number;
  name: string;
  artist: string;
  image?: string;
};

export type AlbumDetails = {
  album: Album;
  musics: Music[];
};
