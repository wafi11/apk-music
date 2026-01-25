import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/router";
interface CardArtistProps {
  artist: {
    artistName: string;
    artistImage: string;
    artistId: number;
  };
}
export function CardArtist({ artist }: CardArtistProps) {
  const router = useRouter();
  return (
    <Card
      key={artist.artistId}
      onClick={() => router.push(`/artist/${artist.artistId}`)}
      className="group cursor-pointer transition-all duration-300 hover:scale-105 border-none shadow-none bg-transparent"
    >
      <CardContent className="p-0">
        <div className="relative aspect-square rounded-full overflow-hidden shadow-md mb-4 bg-muted">
          <Image
            alt={`${artist.artistName} image`}
            src={artist.artistImage}
            width={400}
            height={400}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="text-center px-2">
          <p className="font-semibold truncate group-hover:text-primary transition-colors">
            {artist.artistName}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Artist</p>
        </div>
      </CardContent>
    </Card>
  );
}
