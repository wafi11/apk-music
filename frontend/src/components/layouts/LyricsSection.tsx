import { useLyrics } from "@/features/songs/api/api";
import { Song } from "@/features/songs/types";
import { useAudioStore } from "@/hooks/useSongs";
import { LyricEmptyState, LyricLoadingSkeleton, parseSynced, SyncedLine } from "@/utils/lyric";
import { useEffect, useRef, useState } from "react";

interface LyricSectionProps {
    song: Song;
    open: boolean;
    onOpen: () => void;
}

export function LyricSection({ song }: LyricSectionProps) {
    const { data: lyricsData, isLoading: isLoadingLyrics } = useLyrics(
        song.title,
        song.album,
        song.duration as string,
        song.artist
    );

    const [mode, setMode] = useState<"plain" | "synced">("plain");
    const { currentTime } = useAudioStore();

    // ref untuk scroll container (bukan active line)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLDivElement>(null);

    const syncedLines = lyricsData?.synced ? parseSynced(lyricsData.synced) : [];
    const hasSynced = syncedLines.length > 0;

    const activeIndex = hasSynced
        ? syncedLines.reduce((acc, line, i) => (currentTime >= line.time ? i : acc), -1)
        : -1;

    useEffect(() => {
        if (hasSynced) setMode("synced");
    }, [hasSynced]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        const el = activeRef.current;
        if (!container || !el) return;

        const containerHeight = container.offsetHeight;
        const elOffsetTop = el.offsetTop;
        const elHeight = el.offsetHeight;

        container.scrollTo({
            top: elOffsetTop - containerHeight / 2 + elHeight / 2,
            behavior: "smooth",
        });
    }, [activeIndex]);

    return (
        <div className="w-full flex flex-col gap-3">
            <div
                ref={scrollContainerRef}
                className="overflow-y-auto"
                style={{
                    height: "calc(100vh - 220px)",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {isLoadingLyrics ? (
                    <LyricLoadingSkeleton />
                ) : !lyricsData ? (
                    <LyricEmptyState />
                ) : mode === "synced" && hasSynced ? (
                    <SyncedView
                        lines={syncedLines}
                        activeIndex={activeIndex}
                        activeRef={activeRef}
                    />
                ) : (
                    <PlainView text={lyricsData.plain} />
                )}
            </div>
        </div>
    );
}

function PlainView({ text }: { text: string }) {
    return (
        <p className="whitespace-pre-wrap text-white/50 text-sm leading-8 tracking-wide px-1">
            {text}
        </p>
    );
}

function SyncedView({
    lines,
    activeIndex,
    activeRef,
}: {
    lines: SyncedLine[];
    activeIndex: number;
    activeRef: React.RefObject<HTMLDivElement>;
}) {
    return (
        <div className="flex flex-col">
            {lines.map((line, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;

                return (
                    <div
                        key={i}
                        ref={isActive ? activeRef : undefined}
                        className={`
                            py-0.5 px-1 rounded-md leading-8 select-none cursor-default
                            transition-all duration-300 ease-out
                            ${isActive
                                ? "text-white font-semibold text-base"
                                : isPast
                                    ? "text-white/20 text-sm"
                                    : "text-white/45 text-sm"
                            }
                        `}
                        style={{ transform: isActive ? "translateX(2px)" : "none" }}
                    >
                        {line.text || "♪"}
                    </div>
                );
            })}
        </div>
    );
}