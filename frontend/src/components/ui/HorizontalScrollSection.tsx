import { SectionContainer } from "@/components/layouts/SectionContainer";
import { TitleSection } from "@/components/ui/titleSection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
} from "react";

interface HorizontalScrollSectionProps {
  title: string;
  showAllLink?: string;
  children: ReactNode;
  data: any[];
  scrollRef: RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  setCanScrollLeft: Dispatch<SetStateAction<boolean>>;
  canScrollRight: boolean;
  setCanScrollRight: Dispatch<SetStateAction<boolean>>;
}
export function HorizontalScrollSection({
  title,
  showAllLink,
  children,
  data,
  canScrollLeft,
  canScrollRight,
  scrollRef,
  setCanScrollLeft,
  setCanScrollRight,
}: HorizontalScrollSectionProps) {
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      scrollElement?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [data]);

  return (
    <SectionContainer>
      <TitleSection title={title}>
        {showAllLink && (
          <Link href={showAllLink}>
            <span className="text-md font-semibold hover:underline">
              Show All
            </span>
          </Link>
        )}
      </TitleSection>

      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-accent"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Slider Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth relative z-0"
        >
          <div className="flex gap-4 pb-4">{children}</div>
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-accent"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Gradient Overlays - di bawah arrow tapi di atas konten */}
        {canScrollLeft && (
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        )}
      </div>
    </SectionContainer>
  );
}
