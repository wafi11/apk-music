import Image from "next/image";
import { Album } from "../album";

interface CardAlbumDetailsProps {
    album: Album;
}

export function CardAlbumDetails({ album }: CardAlbumDetailsProps) {
    return (
        <section className="flex items-center gap-6 p-6">

            {/* Album Cover */}
            <div className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden shadow-2xl">
                <Image
                    width={100}
                    height={100}
                    src={album.image}
                    alt={album.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Album Info */}
            <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Album</p>
                <h1 className="text-4xl font-bold text-accent">{album.title}</h1>

                {/* Artist */}
                <div className="flex items-center gap-2 mt-1">

                    <p className="text-sm text-gray-300 font-medium">{album.artist}</p>
                </div>
            </div>
        </section>
    );
}