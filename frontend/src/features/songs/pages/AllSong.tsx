import { PageContainer } from "@/components/layouts/PageContainer";
import { useAllSongs } from "../api/api";
import { TableSong } from "../components/TableSong";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Music } from "../types";

export default function AllSong() {
  const [page, setPage] = useState(1);
  const [allSongs, setAllSongs] = useState<Music[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading } = useAllSongs({
    limit: 10,
    page,
  });

  // Ref untuk observer
  const observerTarget = useRef<HTMLDivElement>(null);

  // Append data baru ke existing songs
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        // Reset saat page 1
        setAllSongs(data.data);
      } else {
        // Append data baru
        setAllSongs((prev) => [...prev, ...data.data]);
      }

      // Check kalau udah ga ada data lagi
      if (data.data.length < 10) {
        setHasMore(false);
      }
    }
  }, [data, page]);

  // Intersection Observer untuk detect scroll ke bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          // Load next page saat element terlihat
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }, // Trigger saat 10% element visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading]);

  return (
    <PageContainer withSidebar={true} className="" withHeader={true}>
      <section className="text-4xl mb-10 font-bold border-b pb-10">
        <h3>All Songs</h3>
        <p className="text-sm text-muted-foreground font-normal mt-2">
          {allSongs.length} songs loaded
        </p>
      </section>

      <section className="flex flex-col gap-2">
        {allSongs.map((item, index) => (
          <TableSong key={item.id || index} index={index} song={item} />
        ))}
      </section>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading more songs...
          </span>
        </div>
      )}

      {/* Observer Target - invisible element di bottom */}
      <div ref={observerTarget} className="h-20" />

      {/* No More Data Message */}
      {!hasMore && allSongs.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          🎵 Gaada Music Lagi Wkwkwk
        </div>
      )}

      {/* Empty State */}
      {!isLoading && allSongs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl text-muted-foreground">No songs found</p>
        </div>
      )}
    </PageContainer>
  );
}
