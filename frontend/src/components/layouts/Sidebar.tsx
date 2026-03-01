import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Library,
  LayoutList,
  Music,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  expanded: boolean;
  setExpanded: (expand: boolean) => void;
}

type SortOption = "recent" | "alphabetical" | "creator";

export function Sidebar({ expanded, setExpanded }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const playlists = [
    { id: 1, name: "Liked Songs", icon: Heart, count: 234, creator: "You" },
    { id: 2, name: "Recently Played", icon: Clock, count: 45, creator: "You" },
    { id: 3, name: "My Playlist #1", icon: Music, count: 12, creator: "You" },
    { id: 4, name: "Chill Vibes", icon: Music, count: 89, creator: "You" },
    { id: 5, name: "Workout Mix", icon: Music, count: 56, creator: "You" },
    { id: 6, name: "Focus Flow", icon: Music, count: 32, creator: "Spotify" },
    { id: 7, name: "Evening Jazz", icon: Music, count: 78, creator: "You" },
  ];

  // Filter playlists based on search
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort playlists
  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "creator":
        return a.creator.localeCompare(b.creator);
      default:
        return 0;
    }
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <aside
      className={cn(
        "sticky h-[calc(100vh-8rem)] border-r border-white/10",
        "transition-all duration-300 ease-in-out overflow-hidden",
        expanded ? "w-80" : "w-20",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {expanded ? (
              <>
                <div className="flex items-center gap-2">
                  <Library className="w-6 h-6 text-gray-400" />
                  <h3 className="text-white font-bold text-base">
                    Your Library
                  </h3>
                </div>
                <div className="flex items-center gap-1">

                  <button
                    onClick={() => setExpanded(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    title="Collapse Library"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group mx-auto"
                title="Expand Library"
              >
                <Library className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Search & Sort */}
        {expanded && (
          <div className="p-3 border-b border-white/10 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search in Your Library"
                className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-white/10 rounded-full transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <LayoutList className="w-4 h-4" />
                <span className="capitalize">{sortBy}</span>
              </button>

              {/* Sort Dropdown */}
              {showSortMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-800 rounded-lg shadow-xl border border-white/10 py-1 z-10">
                  <p className="px-3 py-2 text-xs text-gray-400 font-semibold">
                    Sort by
                  </p>
                  {[
                    { value: "recent", label: "Recent" },
                    { value: "alphabetical", label: "Alphabetical" },
                    { value: "creator", label: "Creator" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as SortOption);
                        setShowSortMenu(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors",
                        sortBy === option.value
                          ? "text-white bg-white/5"
                          : "text-gray-400",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playlists - Expanded */}
        {expanded && (
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {sortedPlaylists.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="text-gray-400 text-sm">No playlists found</p>
                <p className="text-gray-500 text-xs mt-1">
                  Try a different search
                </p>
              </div>
            ) : (
              sortedPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded flex items-center justify-center flex-shrink-0 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                    <playlist.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold truncate text-white">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      Playlist • {playlist.creator} • {playlist.count} songs
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Playlists - Collapsed */}
        {!expanded && (
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {playlists.slice(0, 8).map((playlist) => (
              <button
                key={playlist.id}
                className="w-full p-2 rounded-lg hover:bg-white/5 transition-all group"
                title={playlist.name}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded flex items-center justify-center mx-auto group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                  <playlist.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
