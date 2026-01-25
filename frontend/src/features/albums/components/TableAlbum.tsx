import { AlbumsWithSongs } from "@/features/artists/api/api";
import { TableSong } from "@/features/songs/components/TableSong";
import { Clock } from "lucide-react";
import Image from "next/image";

interface TableAlbumsProps {
  album: AlbumsWithSongs;
}
export function TableAlbums({ album }: TableAlbumsProps) {
  return (
    <div key={album.id} className="mb-12">
      {/* Album Header */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          height={200}
          width={200}
          src={album.image}
          alt={album.name}
          className="w-20 h-20 rounded-lg shadow-xl"
        />
        <div>
          <h2 className="text-2xl font-bold mb-1">{album.name}</h2>
          <p className="text-sm text-gray-400">{album.music.length} songs</p>
        </div>
      </div>

      {/* Songs Table */}
      <div className="bg-gradient-to-b from-gray-900/40 to-transparent rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-6 py-3 text-sm text-gray-400 border-b border-gray-800/50">
          <div className="w-8">#</div>
          <div>Title</div>
          <div className="w-20 text-right">
            <Clock className="w-4 h-4 inline" />
          </div>
          <div className="w-12"></div>
        </div>

        {/* Songs */}
        {album.music.map((song, index) => (
          <TableSong index={index} song={song} key={index} />
        ))}
      </div>
    </div>
  );
}
