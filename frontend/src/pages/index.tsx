import { PageContainer } from "@/components/layouts/PageContainer";
import { homeSections } from "@/features/home/homeSection";
import { useHomeData } from "@/features/home/useHomeData";
import { SectionMusic } from "@/features/songs/components/SectionSongs";

export default function Home() {
  const { songs, albums, artists } = useHomeData();

  const dataMap = { songs, albums, artists };

  return (
    <PageContainer withSidebar withHeader>
      {homeSections.map((section) => {
        const query = dataMap[section.key];
        return (
          <SectionMusic
            key={section.key}
            title={section.title}
            data={query.data?.pages.flatMap((p) => p.data.items as any)}
            renderItem={section.renderItem}
            onReachEnd={() => {
              if (query.hasNextPage && !query.isFetchingNextPage) {
                query.fetchNextPage();
              }
            }}
          />
        );
      })}
    </PageContainer>
  );
}