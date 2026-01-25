import { myQueue, useCreateQueue } from "@/features/queue/api";
import { Music } from "@/features/songs/types";
import { useAudioStore } from "@/hooks/useSongs";
import { useState } from "react";

export function usePlayMusicOrAlbum(song: Music) {
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
  const createQueueMutation = useCreateQueue(song.title);
  const { loadQueue, playFromQueue } = useAudioStore();

  const handlePlayAlbum = async () => {
    // 1. Create queue di backend
    createQueueMutation.mutate();

    const queueData = await myQueue();

    // 3. Load ke audio store
    loadQueue(queueData);

    // 4. Auto play first song
    if (queueData.length > 0) {
      playFromQueue(0);
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
    handlePlayAlbum,
  };
}
