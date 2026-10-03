"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toggleMobileSidebar, toggleSettingsDrawer } from "@/store/slices/uiSlice";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Menu, SlidersHorizontal, WifiOff } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

export function Header() {
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-md border-b border-border transition-colors">
      {/* Network Offline Alert */}
      {!isOnline && (
        <div
          role="status"
          className="bg-amber-500 text-white text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-2"
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Showing cached content and saved favorites.</span>
        </div>
      )}

      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => dispatch(toggleMobileSidebar())}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg">
          <SearchBar />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Tooltip content="Feed Preferences">
            <button
              type="button"
              onClick={() => dispatch(toggleSettingsDrawer())}
              aria-label="Open feed preferences"
              className="hidden sm:inline-flex p-2 rounded-xl border border-border bg-surface text-text-muted hover:text-text hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </Tooltip>

          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
