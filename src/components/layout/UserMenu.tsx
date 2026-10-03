"use client";

import React, { useState, useRef, useEffect } from "react";
import { Settings, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSettingsDrawer } from "@/store/slices/uiSlice";
import { selectFavoritesCount } from "@/store/slices/favoritesSlice";
import Link from "next/link";

export function UserMenu() {
  const dispatch = useAppDispatch();
  const favCount = useAppSelector(selectFavoritesCount);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center shadow-xs">
          GU
        </div>
        <span className="hidden md:inline-block text-xs font-semibold text-text">
          Guest User
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-52 rounded-2xl bg-surface border border-border shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-border/60 mb-1">
            <p className="text-xs font-semibold text-text">Guest User</p>
            <p className="text-[11px] text-text-muted">guest@curate.local</p>
          </div>

          <Link
            href="/favorites"
            onClick={() => setIsOpen(false)}
            role="menuitem"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-text hover:bg-surface-elevated transition-colors"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>Favorites</span>
            </div>
            {favCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold text-[10px]">
                {favCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              dispatch(toggleSettingsDrawer());
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text hover:bg-surface-elevated transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-text-muted" />
            <span>Feed Preferences</span>
          </button>
        </div>
      )}
    </div>
  );
}
