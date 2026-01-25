import { useAudioStore } from "@/hooks/useSongs";
import { ReactQueryProvider } from "@/provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const initializeAudio = useAudioStore((state) => state.initializeAudio);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  return (
    <ReactQueryProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </ReactQueryProvider>
  );
}
