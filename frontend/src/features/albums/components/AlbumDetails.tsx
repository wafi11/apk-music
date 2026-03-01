// AlbumDetails.tsx
import { useSongsByAlbum } from "@/features/songs/api/api";
import { Album } from "../album";
import { CardAlbumDetails } from "./CardAlbumDetails";
import { ListSongs } from "@/features/songs/components/ListSongs";

interface AlbumDetailsProps {
    album: Album;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
    const { data, isLoading } = useSongsByAlbum(album.id);
    const songs = data?.pages.flatMap((p) => p.data.items) ?? [];

    return (
        <div className="flex flex-col gap-6">
            {/* Header Album */}
            <CardAlbumDetails album={album} />

            {/* Song List */}
            <div className="flex flex-col px-6">
                {/* List Header */}
                <div className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-widest border-b border-white/10 mb-2">
                    <span>#</span>
                    <span>Title</span>
                    <span>Artist</span>
                    <span className="text-right">Duration</span>
                </div>

                {/* Loading */}
                {isLoading && (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-md bg-white/5 animate-pulse mb-2" />
                    ))
                )}

                {/* Songs */}
                {songs.map((song, index) => (
                    <ListSongs key={song.id} song={song} index={index + 1} />
                ))}

                {/* Empty */}
                {!isLoading && songs.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">No songs in this album</p>
                )}
            </div>
        </div>
    );
}