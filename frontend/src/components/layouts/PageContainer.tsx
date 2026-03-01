import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HeadMetaData } from "./HeadMetaData";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useMyQueue } from "@/features/queue/api";
import { useAudioStore } from "@/hooks/useSongs";
import { RootLayout } from "./RootLayout";
import { LyricSection } from "./LyricsSection";

type PageContainerProps = {
  withHeader?: boolean;
  withFooter?: boolean;
  withSidebar?: boolean;
};

export const PageContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & PageContainerProps
>(
  (
    {
      className,
      children,
      withHeader = true,
      withFooter = true,
      withSidebar,
      ...props
    },
    ref,
  ) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [isLyricOpen, setIsLyricOpen] = useState<boolean>(false);
    const { data: queueData, isLoading } = useMyQueue();
    const { loadQueue, currentSong } = useAudioStore();

    useEffect(() => {
      if (queueData && queueData.length > 0) {
        loadQueue(queueData);
      }
    }, [queueData, loadQueue]);

    if (isLoading) return <div>Loading queue...</div>;

    const toggleLyric = () => setIsLyricOpen((prev) => !prev);

    return (
      <RootLayout openLyric={isLyricOpen} setOpenLyric={toggleLyric}>
        <HeadMetaData />
        {withHeader && <Header />}

        <div className="flex flex-1 mt-20 overflow-hidden">
          {withSidebar && (
            <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
          )}

          {/* Main content */}
          <main
            ref={ref}
            className={cn("flex-1 overflow-y-auto  min-w-0", className)}
            {...props}
          >
            <div className="p-6">{children}</div>
            {withFooter && (
              <footer className="flex min-h-16 border-t-2 p-4">
                <p className="w-full text-center text-muted-foreground">
                  © {new Date().getFullYear()} Wafiuddin. All rights reserved
                </p>
              </footer>
            )}
          </main>

          {/* Lyric Panel — one scroll zone only */}
          {currentSong && (
            <div
              className="h-full flex-shrink-0 overflow-hidden border-l "
              style={{
                width: isLyricOpen ? "320px" : "0px",
                opacity: isLyricOpen ? 1 : 0,
              }}
            >
              {/* THIS is the only scrollable element */}
              <div className="w-[320px] h-full overflow-y-auto flex flex-col gap-5 px-5 pt-5 bg-background">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                      {currentSong.title}
                    </p>
                    <p className="text-xs text-white/40 tracking-wide mt-0.5">
                      {currentSong.artist}
                    </p>
                  </div>
                  <button
                    onClick={toggleLyric}
                    className="flex-shrink-0 ml-3 mt-0.5 w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all text-sm"
                    aria-label="Close lyrics"
                  >
                    ✕
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                <LyricSection
                  open={true}
                  onOpen={() => { }}
                  song={{
                    ...currentSong,
                    id: currentSong.id as string,
                    album: currentSong.album as string,
                    artist: currentSong.artist as string,
                    duration: currentSong.duration,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </RootLayout>
    );
  },
);

PageContainer.displayName = "PageContainer";