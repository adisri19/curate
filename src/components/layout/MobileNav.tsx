"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileSidebarOpen, toggleSettingsDrawer } from "@/store/slices/uiSlice";
import { selectFavoritesCount } from "@/store/slices/favoritesSlice";
import { Dialog } from "@/components/ui/Dialog";
import { Sidebar } from "./Sidebar";
import { Compass, TrendingUp, Heart, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileSidebarOpen);
  const favoriteCount = useAppSelector(selectFavoritesCount);

  const tabs = [
    {
      href: "/feed",
      label: "Feed",
      icon: Compass,
      isActive: pathname === "/feed" || pathname === "/",
    },
    {
      href: "/trending",
      label: "Trending",
      icon: TrendingUp,
      isActive: pathname === "/trending",
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: Heart,
      isActive: pathname === "/favorites",
      badge: favoriteCount > 0 ? favoriteCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Slide-in Drawer */}
      <Dialog
        isOpen={isOpen}
        onClose={() => dispatch(setMobileSidebarOpen(false))}
        title="Navigation"
        variant="drawer"
      >
        <Sidebar className="border-none p-0 h-auto" />
      </Dialog>

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-md border-t border-border z-40 flex items-center justify-around py-2 px-3 shadow-lg"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg relative transition-colors",
                tab.isActive ? "text-primary font-bold" : "text-text-muted hover:text-text"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold text-[9px] leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => dispatch(toggleSettingsDrawer())}
          className="flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg text-text-muted hover:text-text transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </nav>
    </>
  );
}
