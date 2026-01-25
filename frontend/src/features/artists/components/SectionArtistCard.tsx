import { CardSpotify } from "@/components/ui/cardSpotify";
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection";
import { useSectionActionCard } from "../hooks/useSectionArtistCard";

export function SectionArtistCard() {
  const {
    artistData,
    scrollRef,
    canScrollLeft,
    canScrollRight,
    setCanScrollLeft,
    isHovered,
    setIsHovered,
    setCanScrollRight,
  } = useSectionActionCard();

  return (
    <HorizontalScrollSection
      title="Top Artist"
      scrollRef={scrollRef}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
      setCanScrollLeft={setCanScrollLeft}
      setCanScrollRight={setCanScrollRight}
      showAllLink="/artist"
      data={artistData}
    >
      {artistData.map((artist) => (
        <div key={artist.artistId} className="flex-none w-[200px] snap-start">
          <CardSpotify
            song={{
              album: "",
              artist: "",
              createdAt: "",
              duration: "",
              id: artist.artistId,
              image: artist.artistImage,
              title: artist.artistName,
              url: "",
              updatedAt: "",
            }}
            type="artist"
          />
        </div>
      ))}
    </HorizontalScrollSection>
  );
}
