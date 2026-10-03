"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSettingsDrawer } from "@/store/slices/uiSlice";
import { selectFavoritesCount } from "@/store/slices/favoritesSlice";
import {
  Compass,
  TrendingUp,
  Heart,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const favoriteCount = useAppSelector(selectFavoritesCount);

  const navLinks = [
    {
      href: "/feed",
      label: "My Feed",
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
    <aside
      aria-label="Main Navigation"
      className={cn(
        "flex flex-col h-full bg-surface border-r border-border p-4 select-none",
        className
      )}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 px-3 py-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-text flex items-center gap-1.5">
            Curate
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              v1.0
            </span>
          </span>
          <span className="text-[11px] text-text-muted">Personalized Reader</span>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 space-y-1.5" aria-label="Sidebar Sections">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                link.isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    link.isActive ? "text-primary-foreground" : "text-text-muted"
                  )}
                />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    link.isActive
                      ? "bg-white/20 text-white"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Settings Action Button */}
        <button
          type="button"
          onClick={() => dispatch(toggleSettingsDrawer())}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-surface-elevated transition-colors text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 transition-transform group-hover:rotate-45" />
            <span>Customize Feed</span>
          </div>
        </button>
      </nav>

      {/* Footer Info / Shortcut Hint */}
      <div className="pt-4 border-t border-border/80 px-2 space-y-2">
        <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-text font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Smart Reader</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Drag cards to reorder. Save favorites offline.
          </p>
        </div>
      </div>
    </aside>
  );
}
