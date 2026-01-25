import { useRef, useState } from "react";
import { useAllSongs } from "../api/api";

export function useSectionAllSongs() {
  const [limit] = useState(10);
  const [page] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const { data, isLoading, error } = useAllSongs({
    limit,
    page,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const songs = data?.data;
  return {
    songs,
    isHovered,
    isLoading,
    error,
    limit,
    page,
    scrollRef,
    scroll,
    checkScroll,
    canScrollLeft,
    canScrollRight,
    setCanScrollLeft,
    setCanScrollRight,
    setIsHovered,
  };
}
