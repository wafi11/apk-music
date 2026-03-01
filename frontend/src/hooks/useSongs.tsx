import { MyQueue } from "@/features/queue/types";
import { Song } from "@/features/songs/types";
import { create } from "zustand";

interface AudioState {
  // State
  audioRef: HTMLAudioElement | null;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  queue: Song[];
  currentIndex: number;
  duration: number;
  volume: number;
  isLoading: boolean;

  // Actions
  initializeAudio: () => void;
  playSong: (song: Song) => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  seek: (time: number) => void;
  changeVolume: (vol: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  formatTime: (time: number) => string;
  loadQueue: (queueData: MyQueue[]) => void;
  appendToQueue: (song: Song) => void;
  deleteFromQueue: (songId: string) => void;
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

  loadQueue: (queueData: MyQueue[]) => {
    console.log("loadQueue received:", queueData); // debug

    const songs: Song[] = queueData.map((item) => ({
      id: item.id,
      image: item.image,
      link: item.link,
      title: item.title,
      artist: item.artist,
      duration: item.duration,
      album: item.album,
    }));

    console.log("mapped songs:", songs);

    set({ queue: songs, currentIndex: -1 });
    const { playSong } = get();
    if (queueData.length > 0) {
      playSong(queueData[0]);
    }
  },

  appendToQueue: (song: Song) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
  },

  deleteFromQueue: (songId: string) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((item) => item.id !== songId);

    // Adjust currentIndex if needed
    let newIndex = currentIndex;
    if (currentIndex >= newQueue.length) {
      newIndex = newQueue.length - 1;
    }

    set({ queue: newQueue, currentIndex: newIndex });
  },

  playSong: async (song: Song) => {
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
    audioRef.src = song.link as string;
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

  playPrevious: async () => {
    const { queue, currentIndex, playSong } = get();

    if (currentIndex <= 0) {
      console.log("⚠️ Already at first song");
      return;
    }

    const prevSong = queue[currentIndex - 1];
    await playSong(prevSong);
  },

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
