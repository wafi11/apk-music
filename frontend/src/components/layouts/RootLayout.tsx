import { ReactNode } from "react";
import { BottomHeader } from "./BottomHeader";

interface RootLayoutProps {
  children: ReactNode;
  openLyric: boolean
  setOpenLyric: () => void
}
export function RootLayout({ children, openLyric, setOpenLyric }: RootLayoutProps) {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {children}
      <BottomHeader openLyric={openLyric} setOpenLyric={setOpenLyric} />
    </div>
  );
}
