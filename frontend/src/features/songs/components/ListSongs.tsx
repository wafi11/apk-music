import { usePlayMusicOrAlbum } from "@/features/queue/usePlayMusicOrAlbum";
import { Song } from "../types";
import { Play } from "lucide-react";

interface ListSongsProps {
    song: Song;
    index: number;
}

function formatDuration(duration: string | number) {
    const totalSeconds = Number(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ListSongs({ song, index }: ListSongsProps) {
    const { handlePlayClick, isPlaying } = usePlayMusicOrAlbum({ ...song });
    return (
        <div
            onClick={handlePlayClick}
            className={`grid grid-cols-[24px_1fr_1fr_60px] gap-4 px-4 py-3 rounded-md items-center
                  cursor-pointer group hover:bg-white/10 transition-all duration-150
                  ${isPlaying ? "text-primary" : "text-white"}`}
        >
            {/* Index / Play icon on hover */}
            <div className="flex items-center justify-center w-4">
                <span className={`text-sm group-hover:hidden ${isPlaying ? "text-primary" : "text-gray-400"}`}>
                    {index}
                </span>
                <Play className="size-10" />
            </div>

            {/* Title + Image */}
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={song.image}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                    <p className={`text-sm font-medium truncate ${isPlaying ? "text-primary" : "text-white"}`}>
                        {song.title}
                    </p>
                    {/* artist tampil di sini di mobile, kolom artist hidden */}
                    <p className="text-xs text-gray-400 truncate md:hidden">
                        {song.artist}
                    </p>
                </div>
            </div>

            {/* Artist — hidden di mobile */}
            <p className="text-sm text-gray-400 truncate hidden md:block">
                {song.artist}
            </p>

            {/* Duration */}
            <p className="text-sm text-gray-400 text-right tabular-nums">
                {formatDuration(song.duration as string)}
            </p>
        </div>
    );
}