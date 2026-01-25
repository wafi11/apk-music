import { useSearchMusicHooks } from "@/hooks/useSearchMusic";
import { cn } from "@/lib/utils";
import { Loader2, Music, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";

export function SearchMusic() {
  const {
    handleClear,
    isFocused,
    results,
    search,
    searchRef,
    setSearch,
    showResults,
    setIsFocused,
    isLoading,
  } = useSearchMusicHooks();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl  mx-auto" ref={searchRef}>
      <div className="relative">
        <Search
          className={cn(
            "absolute top-2.5 left-3 size-6 transition-colors pointer-events-none",
            isFocused ? "text-primary" : "text-muted-foreground",
          )}
        />

        <Input
          type="text"
          placeholder="Search for songs, artists, albums..."
          className={cn(
            "pl-10 pr-10 h-11 rounded-full text-md bg-background border-input transition-all duration-200",
            isFocused &&
              "ring-2 ring-ring ring-offset-2 ring-offset-background",
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        <div className="absolute right-3 top-3 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="size-4 text-primary animate-spin" />
          )}
          {search && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-5 w-5 rounded-full p-0 hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <>
                <div className="px-4 py-2 border-b border-border bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {results.length} result{results.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="">
                  {results.map((song) => (
                    <Button
                      key={song.id}
                      variant="ghost"
                      className="w-full h-auto px-3 py-2.5 flex items-center gap-3 justify-start rounded-none group-hover:bg-accent group-hover:text-accent-foreground transition-colors group"
                      onClick={() => {
                        console.log("Selected:", song);
                        setIsFocused(false);
                      }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={song.image}
                          alt={song.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-sm text-foreground truncate">
                          {song.title}
                        </p>
                        <p className="text-xs group-hover:text-blue-900 truncate">
                          {song.artist}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-muted p-3">
                    <Music className="size-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="font-medium text-sm text-foreground">
                  No results found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
