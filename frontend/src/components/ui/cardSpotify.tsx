import { ButtonPlayAlbums } from "@/features/albums/components/ButtonPlay";
import { usePlayMusicOrAlbum } from "@/features/queue/usePlayMusicOrAlbum";
import { DropdownChoiceSong } from "@/features/songs/components/DropdownChoice";
import { Music } from "@/features/songs/types";
import Image from "next/image";
import { useRouter } from "next/router";

interface CardSpotifyProps {
  song: Music;
  type?: "track" | "album" | "artist" | "playlist";
}

export function CardSpotify({ song, type = "track" }: CardSpotifyProps) {
  const {
    handlePlayAlbum,
    handlePlayClick,
    isCurrentSong,
    isHovered,
    isPlaying,
    isThisSongLoading,
    setIsHovered,
  } = usePlayMusicOrAlbum(song);

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/${type}/${song.id}`);
  };

  return (
    <div className="w-full">
      <div
        className="block cursor-pointer"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="hover:bg-primary/30 rounded-lg p-3 transition-all duration-300 hover:shadow-lg">
          <div className="relative mb-3">
            {/* Image Container */}
            <div className="aspect-square rounded-md overflow-hidden bg-muted">
              <Image
                src={song.image || "/placeholder.png"}
                alt={song.title}
                width={180}
                height={180}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Play Button Overlay */}
            {type === "track" && (
              <ButtonPlayAlbums
                isCurrentSong={isCurrentSong}
                isHovered={isHovered}
                isPlaying={isPlaying}
                isThisSongLoading={isThisSongLoading}
                onPlay={handlePlayClick}
              />
            )}

            {type === "album" && (
              <ButtonPlayAlbums
                isCurrentSong={isCurrentSong}
                isHovered={isHovered}
                isPlaying={isPlaying}
                isThisSongLoading={isThisSongLoading}
                onPlay={handlePlayAlbum}
              />
            )}
          </div>

          {/* Content */}
          <div className="space-y-0.5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-md text-foreground line-clamp-1 hover:text-primary transition-colors">
                {song.title}
              </h3>
              {/* Tambahkan stopPropagation di dropdown juga */}
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownChoiceSong id={song.id} />
              </div>
            </div>
            {song.artist && (
              <p className="text-md text-muted-foreground line-clamp-1">
                {song.artist}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
