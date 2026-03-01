import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useRef } from "react"

interface SectionMusicProps<T> {
    title: string
    data: T[] | undefined
    renderItem: (item: T) => React.JSX.Element
    onReachEnd?: () => void
}

export function SectionMusic<T>({ title, data, renderItem, onReachEnd }: SectionMusicProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({
            left: direction === "left" ? -400 : 400,
            behavior: "smooth",
        })
    }

    const handleScroll = () => {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 100
        if (isNearEnd) onReachEnd?.()
    }

    const btnClass = `
    absolute top-1/2 -translate-y-1/2 z-10
    w-8 h-8 rounded-full bg-white text-black shadow-lg
    flex items-center justify-center
    opacity-0 group-hover/scroll:opacity-100
    hover:scale-105 active:scale-95
    transition-all duration-200
  `

    return (
        <div className="relative w-full space-y-3 group/scroll">
            <h2 className="text-2xl font-semibold">{title}</h2>

            <button onClick={() => scroll("left")} className={`${btnClass} left-0 -translate-x-1/2`}>
                <ChevronLeft className="w-4 h-4" />
            </button>

            <section
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex items-center w-full overflow-x-auto gap-4 pb-2 scrollbar-hide px-1"
            >
                {/* loading skeleton */}
                {!data && (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[clamp(140px,12vw,180px)] aspect-square rounded-lg bg-white/10 animate-pulse" />
                    ))
                )}

                {/* empty state */}
                {data?.length === 0 && (
                    <p className="text-sm text-gray-400">No data available</p>
                )}

                {/* render items */}
                {data?.map((item, i) => (
                    <React.Fragment key={i}>
                        {renderItem(item)}
                    </React.Fragment>
                ))}
            </section>

            <button onClick={() => scroll("right")} className={`${btnClass} right-0 translate-x-1/2`}>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}