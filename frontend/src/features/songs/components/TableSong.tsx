import { Button } from "@/components/ui/button";
import { Music } from "@/features/songs/types";
import { useAudioStore } from "@/hooks/useSongs";
import { Heart, MoreHorizontal, Pause, Play } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TableSongProps {
  song: Music;
  index: number;
}
export function TableSong({ song, index }: TableSongProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const playSong = useAudioStore((state) => state.playSong);
  const isPlaying = useAudioStore((state) => state.isPlaying);

  const handlePlayClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await playSong(song);
    } catch (error) {
      console.error("❌ Error playing song:", error);
    }
  };
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden"
    >
      {/* Gradient Background on Hover - using shadcn colors */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Sliding Border Effect - using primary color */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/80 to-primary/50 transition-transform duration-300",
          isHovered ? "translate-x-0" : "-translate-x-full",
        )}
      />

      <div className="relative grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 px-6 py-3 items-center">
        {/* Number/Play Button with Animation */}
        <div className="w-12 flex items-center justify-center relative">
          {/* Number */}
          <span
            className={cn(
              "absolute text-muted-foreground font-medium transition-all duration-300",
              isHovered || isPlaying
                ? "opacity-0 scale-75 rotate-90"
                : "opacity-100 scale-100 rotate-0",
            )}
          >
            {index + 1}
          </span>

          {/* Play Button using shadcn Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayClick}
            className={cn(
              "relative transition-all duration-300 h-10 w-10 rounded-full",
              isHovered || isPlaying
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-90",
            )}
          >
            <div className="relative group/btn">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity duration-300" />

              {/* Button */}
              <div className="relative bg-secondary hover:bg-primary rounded-full p-2 transition-all duration-300 hover:scale-110">
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                )}
              </div>
            </div>
          </Button>
        </div>

        {/* Song Info with Stagger Animation */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Album Art with Zoom & Glow */}
          <div className="relative group/img">
            <div
              className={cn(
                "absolute inset-0 bg-primary rounded blur-xl transition-all duration-500",
                isHovered ? "opacity-30 scale-110" : "opacity-0 scale-100",
              )}
            />
            <img
              src={song.image}
              alt={song.title}
              className={cn(
                "relative w-12 h-12 rounded shadow-lg transition-all duration-500 ring-2 ring-border",
                isHovered
                  ? "scale-110 shadow-2xl shadow-primary/50 rotate-3 ring-primary/50"
                  : "scale-100 rotate-0",
              )}
            />

            {/* Play Overlay on Image */}
            <div
              className={cn(
                "absolute inset-0 bg-background/60 rounded flex items-center justify-center transition-opacity duration-300",
                isHovered && !isPlaying ? "opacity-100" : "opacity-0",
              )}
            >
              <Play className="h-5 w-5 text-foreground" />
            </div>
          </div>

          {/* Text with Slide Animation */}
          <div className="min-w-0 space-y-1">
            <p
              className={cn(
                "font-medium truncate transition-all duration-300",
                isHovered
                  ? "text-primary translate-x-1"
                  : "text-foreground translate-x-0",
              )}
            >
              {song.title}
            </p>
            <p
              className={cn(
                "text-sm truncate transition-all duration-300 delay-75",
                isHovered
                  ? "text-muted-foreground translate-x-1"
                  : "text-muted-foreground/80 translate-x-0",
              )}
            >
              {song.artist}
            </p>
          </div>

          {/* Playing Animation */}
          {isPlaying && (
            <div className="flex items-center gap-0.5 ml-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-0.5 bg-primary rounded-full animate-pulse"
                  style={{
                    height: "16px",
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Duration with Fade */}
        <div
          className={cn(
            "w-20 flex items-center justify-end text-sm transition-all duration-300",
            isHovered
              ? "text-foreground translate-x-0"
              : "text-muted-foreground translate-x-2",
          )}
        >
          {song.duration}
        </div>

        {/* Like Button with Scale Animation - using shadcn Button */}
        <Button
          variant="ghost"
          size="icon"
          // onClick={handleLikeClick}
          className={cn(
            "h-10 w-10 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-300",
              isLiked
                ? "fill-destructive text-destructive scale-110"
                : "text-muted-foreground hover:text-destructive hover:scale-110",
            )}
          />
        </Button>

        {/* More Options with Dropdown - using shadcn DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 transition-all duration-300",
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4",
                "delay-75",
              )}
            >
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Play className="mr-2 h-4 w-4" />
              Add to Queue
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              Add to Liked Songs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress Bar on Bottom (when playing) - using primary color */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
          <div
            className="h-full bg-primary animate-progress"
            style={{
              animation: "progress 301s linear forwards",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
