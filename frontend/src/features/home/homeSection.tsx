import { CardSongs } from "@/features/songs/components/CardSongs";
import { CardAlbums } from "@/features/albums/components/CardAlbums";
import { Artists } from "../artists/types";

export const homeSections = [
  {
    key: "songs",
    title: "Trends",
    renderItem: (item: any) => <CardSongs data={item} key={item.id} />,
  },
  {
    key: "albums",
    title: "Albums",
    renderItem: (item: any) => <CardAlbums type="album" key={item.id} data={item} />,
  },
  {
    key: "artists",
    title: "Artists",
    renderItem: (item: Artists) => <CardAlbums key={item.id} type="artist" data={{
      artist: "",
      id: item.id,
      image: item.image,
      title: item.name,
      ytId: ""
    }} />,
  },
] as const;