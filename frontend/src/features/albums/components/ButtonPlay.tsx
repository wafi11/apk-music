import { Button } from "@/components/ui/button/button";
import { myQueue, useCreateQueue } from "@/features/queue/api";
import { useAudioStore } from "@/hooks/useSongs";
import { Loader2, Pause, Play } from "lucide-react";

interface ButtonPlayAlbumProps {
  isHovered: boolean;
  isCurrentSong: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  isThisSongLoading: boolean;
}

export function ButtonPlayAlbums({
  isCurrentSong,
  isHovered,
  isPlaying,
  isThisSongLoading,
  onPlay,
}: ButtonPlayAlbumProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick from firing
    onPlay();
  };

  return (
    <div
      className={`absolute bottom-2 z-50 right-2 transition-all duration-300 ${
        isHovered || (isCurrentSong && isPlaying)
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      }`}
    >
      <button
        onClick={handleClick}
        disabled={isThisSongLoading}
        className={`rounded-full p-3 shadow-lg hover:scale-110 transition-all ${
          isCurrentSong && isPlaying
            ? "bg-accent hover:bg-accent/90"
            : "bg-primary/90 text-white"
        } text-primary-foreground`}
      >
        {isThisSongLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isCurrentSong && isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>
    </div>
  );
}
