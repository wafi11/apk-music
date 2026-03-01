export type Playlist = {
  name: string;
  id: string;
};
export type LFMArtist = {
  name: string;
  url: string;
};

export type LFMImage = {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | string;
};

export type LFMTrack = {
  name: string;
  duration: string;
  playcount: string;
  listeners: string;
  url: string;
  artist: LFMArtist;
  image: LFMImage[];
};

export type LFMTopTracksResponse = {
  tracks: {
    track: LFMTrack[];
  };
};
export type DeezerArtist = {
  id: number;
  name: string;
  picture: string;
};

export type DeezerAlbum = {
  id: number;
  title: string;
  cover: string;
  cover_medium: string;
};

export type DeezerTrack = {
  id: number;
  title: string;
  duration: number;
  rank: number;
  link: string;
  preview: string; // free 30s MP3
  artist: DeezerArtist;
  album: DeezerAlbum;
};

export type DeezerChartResponse = {
  data: DeezerTrack[];
  total: number;
};

export type PostSong = {
  _id: string;
  uId?: string;
  uNm?: string;
  text?: string;
  pl?: Playlist;
  name: string;
  eId?: string;
  ctx?: string;
  img?: string;
  nbP?: number;
  order?: number;
  score?: number;
};

export type SearchResults = {
  posts: PostSong[];
  playlists: Playlist[];
};

export type SearchResponse = {
  q: string;
  results: SearchResults;
};

export type HotResponse = {
  hasMore: boolean | number;
  tracks: PostSong[];
};

export type TopMusic = {
  id: string;
  title: string;
  image: string;
  isUseIdYt: boolean;
};

export type Resource = {
  resource_id: string;
  quality: string;
  format: string;
  type: string;
  size: number;
  resource_content: string;
  download_mode: string;
  download_url: string;
};

export type YtMusicResponse = {
  title: string;
  thumbnail: string;
  duration: number;
  resources: Resource[];
};

export type ApiResponse = {
  data: YtMusicResponse;
  status: number;
};
