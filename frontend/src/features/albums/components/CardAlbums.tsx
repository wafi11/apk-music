import Image from "next/image"
import Link from "next/link"
import { Album } from "../album"

interface CardAlbumProps {
    data: Album
    type: "album" | "artist"
}

export function CardAlbums({ data, type }: CardAlbumProps) {
    return (

        <Link
            key={data.id}
            href={`/${type}/${data.id}`}
            className="flex-shrink-0 group relative flex flex-col gap-3 p-3 pb-4 overflow-hidden cursor-pointer
                       bg-primary/20 hover:bg-accent
                       transition-all duration-300 ease-out rounded-lg w-[180px]"
            style={{ fontFamily: "'Circular', 'DM Sans', sans-serif" }}
        >
            {/* Album Art Container */}
            <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-2xl flex-shrink-0">
                <Image
                    src={data.image}
                    alt={data.title}
                    width={1000}
                    height={1000}
                    className="bg-cover w-full h-40"
                />


            </div>

            <div className="flex flex-col gap-1 min-w-0">
                <p
                    className="text-[12px] font-semibold text-gray-300 truncate leading-tight"
                    title={data.artist}
                >
                    {data.artist}
                </p>
                <p
                    className="text-[14px] font-bold text-white truncate leading-tight"
                    title={data.title}
                >
                    {data.title}
                </p>

            </div>
        </Link>
    )
}