export interface PostSong {
  linkSpotify: string;
  linkYtMusic: string;
}

export interface QueryRequestParams {
  limit: number;
  page: number;
  search?: string;
}

export type Music = {
  album: string;
  artist: string;
  createdAt: string;
  duration: string;
  id: number;
  image: string;
  title: string;
  updatedAt: string;
  url: string | null;
};

export type SearchMusic = {
  artist: string;
  createdAt: string;
  id: number;
  image: string;
  title: string;
};
