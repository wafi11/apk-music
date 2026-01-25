// store/useAudioStore.ts
import { Music } from "@/features/songs/types";
import { MyQueue } from "@/features/queue/types";
import { create } from "zustand";

interface AudioState {
  // State
  audioRef: HTMLAudioElement | null;
  currentSong: Music | null;
  isPlaying: boolean;
  currentTime: number;
  queue: Music[];
  currentIndex: number; // ✅ Track posisi di queue
  duration: number;
  volume: number;
  isLoading: boolean;

  // Actions
  initializeAudio: () => void;
  playSong: (song: Music) => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  seek: (time: number) => void;
  changeVolume: (vol: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  formatTime: (time: number) => string;

  // ✅ Queue Management
  loadQueue: (queueData: MyQueue[]) => void;
  appendToQueue: (song: Music) => void;
  deleteFromQueue: (songId: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  playFromQueue: (index: number) => Promise<void>;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial State
  audioRef: null,
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isLoading: false,

  // Initialize Audio Element
  initializeAudio: () => {
    const audio = new Audio();

    // Event Listeners
    audio.addEventListener("timeupdate", () => {
      set({ currentTime: audio.currentTime });
    });

    audio.addEventListener("durationchange", () => {
      set({ duration: audio.duration });
    });

    audio.addEventListener("ended", () => {
      // ✅ Auto play next song
      const { playNext } = get();
      playNext();
    });

    audio.addEventListener("canplay", () => {
      set({ isLoading: false });
    });

    audio.addEventListener("waiting", () => {
      set({ isLoading: true });
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      set({ isLoading: false, isPlaying: false });
    });

    set({ audioRef: audio });
  },

  // ✅ Load Queue dari Backend
  loadQueue: (queueData: MyQueue[]) => {
    const songs: Music[] = queueData.map((item) => ({
      album: item.songName,
      artist: "",
      image: item.songImage,
      createdAt: "",
      updatedAt: "",
      duration: item.songDuration,
      id: item.queueItemsId,
      title: item.songName,
      url: item.songUrlStreaming,
    }));

    set({
      queue: songs,
      currentIndex: -1, // Reset index
    });

    console.log(`✅ Loaded ${songs.length} songs to queue`);
  },

  // ✅ Append to Queue
  appendToQueue: (song: Music) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
  },

  // ✅ Delete from Queue (FIXED!)
  deleteFromQueue: (songId: number) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((item) => item.id !== songId);

    // Adjust currentIndex if needed
    let newIndex = currentIndex;
    if (currentIndex >= newQueue.length) {
      newIndex = newQueue.length - 1;
    }

    set({ queue: newQueue, currentIndex: newIndex });
  },

  // ✅ Play Song (Support Queue)
  playSong: async (song: Music) => {
    const { audioRef, currentSong, isPlaying, volume, queue } = get();

    if (!audioRef) return;

    // Toggle if same song
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.pause();
        set({ isPlaying: false });
      } else {
        try {
          await audioRef.play();
          set({ isPlaying: true });
        } catch (error) {
          console.error("Play error:", error);
        }
      }
      return;
    }

    // Find song index in queue
    const songIndex = queue.findIndex((s) => s.id === song.id);

    set({ isLoading: true, currentSong: song, currentIndex: songIndex });
    audioRef.src = song.url as string;
    audioRef.volume = volume;

    try {
      await audioRef.play();
      set({ isPlaying: true, isLoading: false });
      console.log("✅ Playing:", song.title);
    } catch (error) {
      console.error("❌ Play error:", error);
      set({ isPlaying: false, isLoading: false });
    }
  },

  // ✅ Play Next Song in Queue
  playNext: async () => {
    const { queue, currentIndex, playSong } = get();

    if (queue.length === 0) {
      console.log("⚠️ Queue is empty");
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      console.log("🏁 End of queue");
      set({ isPlaying: false });
      return;
    }

    const nextSong = queue[nextIndex];
    await playSong(nextSong);
  },

  // ✅ Play Previous Song
  playPrevious: async () => {
    const { queue, currentIndex, playSong } = get();

    if (currentIndex <= 0) {
      console.log("⚠️ Already at first song");
      return;
    }

    const prevSong = queue[currentIndex - 1];
    await playSong(prevSong);
  },

  // ✅ Play from Specific Queue Index
  playFromQueue: async (index: number) => {
    const { queue, playSong } = get();

    if (index < 0 || index >= queue.length) {
      console.error("❌ Invalid queue index");
      return;
    }
    console.log("playing ");
    await playSong(queue[index]);
  },

  // Pause
  pause: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      set({ isPlaying: false });
    }
  },

  // Resume
  resume: async () => {
    const { audioRef } = get();
    if (audioRef) {
      try {
        await audioRef.play();
        set({ isPlaying: true });
      } catch (error) {
        console.error("Resume error:", error);
        set({ isPlaying: false });
      }
    }
  },

  // Seek
  seek: (time: number) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.currentTime = time;
      set({ currentTime: time });
    }
  },

  // Change Volume
  changeVolume: (vol: number) => {
    const { audioRef } = get();
    if (audioRef) {
      const newVolume = Math.max(0, Math.min(1, vol));
      audioRef.volume = newVolume;
      set({ volume: newVolume });
    }
  },

  // Setters
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDuration: (duration: number) => set({ duration }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  // Format Time Helper
  formatTime: (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  },
}));
