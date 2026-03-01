import { usePlayMusicOrAlbum } from "@/features/queue/usePlayMusicOrAlbum"
import Image from "next/image"
import { Song } from "../types"

interface CardSongsProps {
    data: Song
}

export function CardSongs({ data }: CardSongsProps) {
    const { handleQueue } = usePlayMusicOrAlbum({
        ...data,

    })
    return (
        <div
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

                {/* Spotify-style green play button */}
                <div className="absolute bottom-2 right-2 translate-y-2 opacity-0
                                group-hover:translate-y-0 group-hover:opacity-100
                                transition-all duration-200 ease-out">
                    <button
                        onClick={handleQueue}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl
                                   bg-primary hover:bg-accent hover:scale-105
                                   active:scale-95 transition-all duration-150"
                    >
                        <svg
                            className="w-5 h-5 text-black translate-x-[1px]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
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
        </div>
    )
}