import Image from "next/image";
import { ReactNode } from "react";

interface AuthComponentProps {
  children: ReactNode;
}

export function AuthComponent({ children }: AuthComponentProps) {
  return (
    <main className="fixed inset-0 flex overflow-hidden">
      {/* LEFT */}
      <section className="w-full max-w-md flex flex-col justify-center px-8 lg:px-12 shadow-lg z-10 overflow-hidden">
        {children}
      </section>

      {/* RIGHT */}
      <section className="relative hidden lg:flex flex-1 bg-sky-400 overflow-hidden">
        <Image
          src="/SD-BG.png"
          alt="Banner Image"
          fill
          priority
          className="object-cover"
        />
      </section>
    </main>
  );
}
