import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
  X,
} from "lucide-react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/hooks/useSongs";
import { useLyrics } from "@/features/songs/api/api";
import { useState } from "react";


interface BottomHeaderProps {
  openLyric: boolean
  setOpenLyric: (open: boolean) => void
}

export function BottomHeader({ openLyric, setOpenLyric }: BottomHeaderProps) {


  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    playNext,
    playPrevious,
    seek,
    changeVolume,
    formatTime,
  } = useAudioStore();


  if (!currentSong) return null;


  return (
    <>

      {/* Bottom Player */}
      <div className="sticky bottom-0 left-0 right-0 bg-aurora border-t z-20 pointer-events-none">
        <div className="px-4 py-3 pointer-events-auto">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 min-w-0 w-[30%]">
              <div className="relative flex-shrink-0 group">
                <Image
                  src={currentSong.image}
                  alt={currentSong.title}
                  width={56}
                  height={56}
                  className="rounded-md shadow-lg"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black flex items-center justify-center rounded-md">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </p>
                <p className="font-semibold text-[12px] text-white truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </p>
              </div>

              <button className="p-2 hover:text-accent text-zinc-400 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* CENTER SECTION */}
            <div className="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={playPrevious} className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={isPlaying ? pause : resume}
                  disabled={isLoading}
                  className="p-2 bg-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 text-black fill-black" />
                  ) : (
                    <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                  )}
                </button>
                <button onClick={playNext} className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-zinc-400 min-w-[40px] text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="relative flex-1 group">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={([value]) => seek(value)}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-xs text-zinc-400 min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center justify-end gap-2 w-[40%]">
              <button
                onClick={() => setOpenLyric(true)}
                className={`p-2 transition-colors ${openLyric ? "text-primary" : "text-zinc-400 hover:text-white"
                  }`}
              >
                <ListMusic className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeVolume(volume > 0 ? 0 : 1)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-24 group">
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => changeVolume(value / 100)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}