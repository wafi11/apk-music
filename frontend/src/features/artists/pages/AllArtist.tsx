import { PageContainer } from "@/components/layouts/PageContainer";
import { useFindAllArtist } from "../api/api";
import Image from "next/image";
import { CardArtist } from "../components/CardArtist";

export default function AllArtist() {
  const { data } = useFindAllArtist(100);
  const artistData = data?.data;

  return (
    <PageContainer withSidebar={true} withHeader={true}>
      <section className="border-b pb-6 mb-8">
        <h3 className="text-3xl font-bold tracking-tight">All Artists</h3>
        <p className="text-muted-foreground mt-2">
          Discover your favorite artists
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {artistData?.map((item) => (
          <CardArtist artist={item} key={item.artistId} />
        ))}
      </section>
    </PageContainer>
  );
}
