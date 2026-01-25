import { useRef, useState } from "react";
import { useFindAllAlbums } from "../api/api";

export function useSectionAllAllbums() {
  const [limit] = useState(10);
  const [page] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const { data, isLoading, error } = useFindAllAlbums(limit, page);
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
  const albums = data?.data;
  return {
    albums,
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
