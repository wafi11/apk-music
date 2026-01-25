import { CardSpotify } from "@/components/ui/cardSpotify";
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection";
import { useSectionAllSongs } from "../hooks/useSectionAllSongs";

export function SectionAllSongs() {
  const {
    songs,
    canScrollLeft,
    canScrollRight,
    scrollRef,
    setCanScrollLeft,
    setCanScrollRight,
  } = useSectionAllSongs();

  return (
    <HorizontalScrollSection
      scrollRef={scrollRef}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
      setCanScrollLeft={setCanScrollLeft}
      setCanScrollRight={setCanScrollRight}
      title="Top Songs"
      showAllLink="/songs"
      data={songs || []}
    >
      {songs?.map((song) => (
        <div key={song.id} className="flex-none w-[200px] snap-start">
          <CardSpotify song={song} type="track" />
        </div>
      ))}
    </HorizontalScrollSection>
  );
}
