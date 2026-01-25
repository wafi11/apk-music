import { useSearchMusic } from "@/features/songs/api/api";
import { useRef, useState } from "react";

export function useSearchMusicHooks() {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { data, isLoading } = useSearchMusic(search);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const results = data?.pages.flatMap((item) => item.data) || [];
  const showResults = isFocused && search && (results.length > 0 || !isLoading);
  const handleClear = () => {
    setSearch("");
    setIsFocused(false);
  };
  return {
    search,
    isLoading,
    isFocused,
    searchRef,
    setSearch,
    results,
    showResults,
    setIsFocused,
    handleClear,
  };
}
