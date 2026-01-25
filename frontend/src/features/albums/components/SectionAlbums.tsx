import { CardSpotify } from "@/components/ui/cardSpotify";
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection";
import { useSectionAllAllbums } from "../hooks/useSectionAllAlbums";

export function SectionAllAlbums() {
  const {
    albums,
    canScrollLeft,
    canScrollRight,
    scrollRef,
    setCanScrollLeft,
    setCanScrollRight,
  } = useSectionAllAllbums();

  return (
    <HorizontalScrollSection
      scrollRef={scrollRef}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
      setCanScrollLeft={setCanScrollLeft}
      setCanScrollRight={setCanScrollRight}
      title="Top Albums"
      showAllLink="/albums"
      data={albums?.data || []}
    >
      {albums?.data.map((album) => (
        <div key={album.id} className="flex-none w-[200px] snap-start">
          <CardSpotify
            song={{
              album: "",
              artist: "",
              createdAt: "",
              duration: "",
              id: album.id,
              image: album.image as string,
              title: album.name,
              url: "",
              updatedAt: "",
            }}
            type="album"
          />
        </div>
      ))}
    </HorizontalScrollSection>
  );
}
