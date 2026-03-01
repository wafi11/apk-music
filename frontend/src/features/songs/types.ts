export type TrendsSong = Song & {};

export type Song = {
  id: string;
  title: string;
  image: string;
  link: string;
  album: string;
  duration?: string;
  artist: string;
};

export type SongResponse = {
  success: boolean;
  items: Song[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
