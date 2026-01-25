import { PageContainer } from "@/components/layouts/PageContainer";
import { useFindArtistDetails } from "../api/api";
import { useParams } from "next/navigation";
import {
  Clock,
  Heart,
  Loader2,
  MoreHorizontal,
  Play,
  Share2,
  Music2,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { TableAlbums } from "@/features/albums/components/TableAlbum";

export default function ArtistDetailsPage() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const [likedSongs, setLikedSongs] = useState(new Set<number>());
  const [isFollowing, setIsFollowing] = useState(false);
  const { data, isLoading } = useFindArtistDetails(id);

  const toggleLike = (songId: number) => {
    setLikedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (!params || isLoading) {
    return (
      <PageContainer withSidebar={true} withHeader={true}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-[#7877C6] animate-spin" />
        </div>
      </PageContainer>
    );
  }

  const artistDetails = data?.data;

  if (!artistDetails) {
    return (
      <PageContainer withSidebar={true} withHeader={true}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Music2 className="w-16 h-16 text-gray-600" />
          <p className="text-gray-400 text-lg">Artist not found</p>
        </div>
      </PageContainer>
    );
  }

  const totalSongs = artistDetails.albums.reduce(
    (acc, album) => acc + (album.music?.length || 0),
    0,
  );

  return (
    <PageContainer withSidebar={true} withHeader={true}>
      <div className="min-h-screen relative">
        {/* Hero Section with Gradient Overlay */}
        <div className="relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#7877C6]/20 via-transparent to-transparent h-[500px] blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
            <div className="flex flex-col md:flex-row items-end gap-8">
              {/* Artist Image */}
              <div className="relative group shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7877C6] via-[#38BDF8] to-[#EC4899] opacity-50 blur-2xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative">
                  <Image
                    width={240}
                    height={240}
                    src={artistDetails.details.artistImage}
                    alt={artistDetails.details.artistName}
                    className="w-60 h-60 rounded-full object-cover shadow-2xl ring-4 ring-[#7877C6]/30 relative z-10"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7877C6] to-[#38BDF8]" />
                  <p className="text-sm font-semibold text-[#7877C6]">
                    Verified Artist
                  </p>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-[#7877C6] to-[#38BDF8] bg-clip-text text-transparent leading-tight bebas tracking-wider">
                  {artistDetails.details.artistName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                    <span className="font-medium">
                      {artistDetails.albums.length} Albums
                    </span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                    <span className="font-medium">{totalSongs} Songs</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7877C6]" />
                    <span className="font-medium">1.2M Monthly Listeners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/80 border-b border-[#7877C6]/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              {/* Play Button */}
              <button className="group relative w-16 h-16 bg-gradient-to-br from-[#7877C6] to-[#38BDF8] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#7877C6]/50">
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <Play className="w-7 h-7 ml-1 relative z-10" fill="white" />
              </button>

              {/* Follow Button */}
              <button
                onClick={toggleFollow}
                className={`px-8 h-12 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  isFollowing
                    ? "bg-transparent border-2 border-[#7877C6] text-[#7877C6] hover:border-[#38BDF8] hover:text-[#38BDF8]"
                    : "bg-gradient-to-r from-[#7877C6] to-[#38BDF8] text-white hover:shadow-lg hover:shadow-[#7877C6]/50"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              {/* More Actions */}
              <button className="w-12 h-12 border-2 border-[#7877C6]/30 hover:border-[#7877C6] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#7877C6]/10">
                <Share2 className="w-5 h-5 text-gray-400 hover:text-[#7877C6] transition-colors" />
              </button>

              <button className="w-12 h-12 border-2 border-[#7877C6]/30 hover:border-[#7877C6] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#7877C6]/10">
                <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-[#7877C6] transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Albums Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-[#7877C6] bg-clip-text text-transparent">
              Discography
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#7877C6] via-[#38BDF8] to-[#EC4899] rounded-full" />
          </div>

          {/* Albums Grid */}
          <div className="space-y-12">
            {artistDetails.albums.length > 0 ? (
              artistDetails.albums.map((album, albumIndex) => (
                <div
                  key={albumIndex}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#7877C6]/5 via-transparent to-[#38BDF8]/5 border border-[#7877C6]/10 hover:border-[#7877C6]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#7877C6]/20"
                >
                  <TableAlbums album={album} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Music2 className="w-20 h-20 text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg">No albums found</p>
                <p className="text-gray-600 text-sm mt-2">
                  This artist hasn't released any albums yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
