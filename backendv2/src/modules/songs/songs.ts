export type TopMusic = {
  title: string;
  image: string | null;
  id: string;
  isUseIdYt?: boolean;
  link: string | null;
};

export type ResponseFromYoutube = {
  type: string;
  videoId: string;
  name: string;
  artist: {
    name: string;
    artistId: string;
  };
  album: {
    name: string;
    albumId: string;
  };
  duration: number;
  thumbnails: [
    {
      url: string;
      width: number;
      height: number;
    },
    {
      url: string;
      width: number;
      height: number;
    },
  ];
};
