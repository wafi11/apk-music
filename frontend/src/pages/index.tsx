import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionAllAlbums } from "@/features/albums/components/SectionAlbums";
import { SectionArtistCard } from "@/features/artists/components/SectionArtistCard";
import { SectionAllSongs } from "@/features/songs/components/SectionAllSongs";

export default function Home() {
  return (
    <PageContainer withSidebar={true} withHeader={true}>
      <SectionAllSongs />
      <SectionAllAlbums />
      <SectionArtistCard />
    </PageContainer>
  );
}
