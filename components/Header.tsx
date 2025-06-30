"use client";

import Toolbar from "./Toolbar";
import { useSidebarStore } from "@/components/Sidebar";

export default function Header({title, children}: {title: string, children?: React.ReactNode}) {
  const { sidebarOpen } = useSidebarStore();

  return (
    <div className="sticky top-0 z-10 left-0 right-0 p-4 border-b border-gray-3 dark:border-gray-2 flex flex-row gap-4 items-center justify-between">
        
        
        <div className="flex flex-row gap-4 items-center">
          {!sidebarOpen && (
            <Toolbar/>
          )}
          
          <p className="text-xs text-gray-11">
            {title}
          </p>
        </div>

        {children}
      </div>
  );
}