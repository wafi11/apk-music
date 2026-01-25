import { ReactNode } from "react";
import { BottomHeader } from "./BottomHeader";

interface RootLayoutProps {
  children: ReactNode;
}
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {children}
      <BottomHeader />
    </div>
  );
}
