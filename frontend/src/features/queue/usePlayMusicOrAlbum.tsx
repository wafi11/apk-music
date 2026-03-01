import { myQueue, useCreateQueue } from "@/features/queue/api";
import { Song } from "@/features/songs/types";
import { useAudioStore } from "@/hooks/useSongs";
import { useState } from "react";

export function usePlayMusicOrAlbum(song: Song) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const playSong = useAudioStore((state) => state.playSong);
  const currentSong = useAudioStore((state) => state.currentSong);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const isLoading = useAudioStore((state) => state.isLoading);

  const isCurrentSong = currentSong?.id === song.id;
  const isThisSongLoading = isCurrentSong && isLoading;
  const handlePlayClick = async () => {
    try {
      await playSong(song);
    } catch (error) {
      console.error("❌ Error playing song:", error);
    }
  };
  const createQueueMutation = useCreateQueue({
    songs: [
      {
        id: song.id
      }
    ]
  });
  const { loadQueue } = useAudioStore();

  const handleQueue = async () => {
    try {
      // ✅ tunggu sampai queue selesai dibuat dulu
      await createQueueMutation.mutateAsync();

      // baru fetch queue yang sudah ada
      const queueData = await myQueue();
      console.log(queueData);

      loadQueue(queueData);
    } catch (error) {
      console.error("❌ Error creating queue:", error);
    }
  };
  return {
    isCurrentSong,
    isHovered,
    playSong,
    isLoading,
    isPlaying,
    isThisSongLoading,
    setIsHovered,
    handlePlayClick,
    handleQueue,
  };
}
