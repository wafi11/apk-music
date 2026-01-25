// app/album/[id]/page.tsx
import { PageContainer } from "@/components/layouts/PageContainer";
import { useParams } from "next/navigation";
import { useFindAlbumById } from "../api/api";
import { useState } from "react";
import {
  Play,
  Pause,
  Heart,
  Clock,
  Music2,
  Download,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/hooks/useSongs";
import { TableSong } from "@/features/songs/components/TableSong";
import Image from "next/image";

export default function AlbumDetailsPage() {
  const params = useParams();
  const id = parseInt(params?.id as string);

  const [isLiked, setIsLiked] = useState(false);
  const playSong = useAudioStore((state) => state.playSong);
  const isPlaying = useAudioStore((state) => state.isPlaying);

  const { data, isLoading } = useFindAlbumById(id);

  if (!id) {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer withSidebar={true} withHeader={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading album...</div>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer withSidebar={true} withHeader={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Album not found</div>
        </div>
      </PageContainer>
    );
  }

  const handlePlayAlbum = async () => {
    if (data.musics && data.musics.length > 0) {
      try {
        await playSong(data.musics[0]);
      } catch (error) {
        console.error("Error playing album:", error);
      }
    }
  };

  const totalDuration = data.musics.reduce((acc, song) => {
    const [min, sec] = song.duration.split(":").map(Number);
    return acc + (min * 60 + sec);
  }, 0);

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  return (
    <PageContainer withSidebar={true} withHeader={true}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/20 via-primary/10 to-background pb-8 -mx-6 -mt-6 px-6 pt-6">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          {/* Album Cover */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <img
              src={data.album.image || "/placeholder-album.png"}
              alt={data.album.name}
              className="relative w-64 h-64 rounded-lg shadow-2xl ring-1 ring-border group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Album Info */}
          <div className="flex-1 space-y-4 pb-4">
            <Badge variant="secondary" className="mb-2">
              Album
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              {data.album.name}
            </h1>

            <div className="flex items-center gap-2 text-sm">
              <Image
                width={400}
                height={400}
                src={data.album.image || "/placeholder-album.png"}
                alt={data.album.artist}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold text-foreground">
                {data.album.artist}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {data.musics.length} songs
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {formatTotalDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="py-6">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={handlePlayAlbum}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={cn(
                "h-7 w-7 transition-all",
                isLiked
                  ? "fill-destructive text-destructive scale-110"
                  : "text-muted-foreground",
              )}
            />
          </Button>

          <Button variant="ghost" size="icon" className="h-12 w-12">
            <Download className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="h-12 w-12">
            <Share2 className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Add to Queue</DropdownMenuItem>
              <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Go to Artist</DropdownMenuItem>
              <DropdownMenuItem>Share Album</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      {/* Songs List */}
      <div className="py-6">
        {/* Table Header */}
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b mb-2">
          <div className="w-12 text-center">#</div>
          <div>Title</div>
          <div className="w-16 text-right">
            <Clock className="h-4 w-4 inline" />
          </div>
          <div className="w-20"></div>
        </div>

        {/* Songs - pakai TableSong component yang udah ada */}
        <div className="space-y-1">
          {data.musics.map((song, index) => (
            <TableSong key={song.id} song={song} index={index} />
          ))}
        </div>

        {/* Album Footer Info */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-start gap-4">
            <img
              src={data.album.image || "/placeholder-album.png"}
              alt={data.album.name}
              className="w-16 h-16 rounded"
            />
            <div>
              <p className="text-sm text-muted-foreground">Album</p>
              <h3 className="text-2xl font-bold">{data.album.name}</h3>
              <p className="text-muted-foreground mt-1">{data.album.artist}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Music2 className="h-4 w-4" />
                <span>{data.musics.length} songs</span>
                <span>•</span>
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
