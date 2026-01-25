import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HeadMetaData } from "./HeadMetaData";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomHeader } from "./BottomHeader";
import { useMyQueue } from "@/features/queue/api";
import { useAudioStore } from "@/hooks/useSongs";
import { RootLayout } from "./RootLayout";

type PageContainerProps = {
  withHeader?: boolean;
  withFooter?: boolean;
  withSidebar?: boolean;
};

export const PageContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & PageContainerProps
>(
  (
    {
      className,
      children,
      withHeader = true,
      withFooter = true,
      withSidebar,
      ...props
    },
    ref,
  ) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const { data: queueData, isLoading } = useMyQueue();
    const { loadQueue } = useAudioStore();

    // ✅ Load queue saat data tersedia
    useEffect(() => {
      if (queueData && queueData.length > 0) {
        loadQueue(queueData);
        console.log("✅ Queue loaded from backend");
      }
    }, [queueData, loadQueue]);

    if (isLoading) return <div>Loading queue...</div>;

    return (
      <RootLayout>
        <HeadMetaData />
        {withHeader && <Header />}
        <div className="flex flex-1 mt-20 overflow-hidden">
          {withSidebar && (
            <Sidebar
              expanded={sidebarExpanded}
              setExpanded={setSidebarExpanded}
            />
          )}

          <main
            ref={ref}
            className={cn("flex-1 overflow-y-auto pb-24", className)}
            {...props}
          >
            <div className="p-6">{children}</div>
            {withFooter && (
              <footer className="flex min-h-16 border-t-2 p-4">
                <p className="w-full text-center text-muted-foreground">
                  © 2025 Wafiuddin. All rights reserved
                </p>
              </footer>
            )}
          </main>
        </div>
      </RootLayout>
    );
  },
);
PageContainer.displayName = "PageContainer";
