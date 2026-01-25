import { useRef, useState } from "react";
import { useFindAllArtist } from "../api/api";

export function useSectionActionCard() {
  const { data } = useFindAllArtist(10);
  const [isHovered, setIsHovered] = useState(false);
  const artistData = data?.data ?? [];
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

  return {
    artistData,
    isHovered,
    scrollRef,
    canScrollLeft,
    canScrollRight,
    checkScroll,
    scroll,
    setCanScrollLeft,
    setCanScrollRight,
    setIsHovered,
  };
}
