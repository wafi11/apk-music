export type Album = {
  id: string;
  title: string;
  image: string;
  ytId: string;
  artist: string;
};

export type AlbumsResponse = {
  success: boolean;
  items: Album[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
