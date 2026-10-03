"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite, selectIsFavorite } from "@/store/slices/favoritesSlice";
import { recordHistory } from "@/store/slices/historySlice";
import { showToast } from "@/store/slices/uiSlice";
import { ContentItem } from "@/types/content";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  item: ContentItem;
  className?: string;
}

export function FavoriteButton({ item, className }: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const isFav = useAppSelector(selectIsFavorite(item.id));

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(toggleFavorite(item));

    if (!isFav) {
      // Record in history for recommendation personalization
      const tmdbIdMatch = item.type === "movie" ? parseInt(item.id.replace("movie:", ""), 10) : undefined;
      dispatch(
        recordHistory({
          id: item.id,
          type: item.type,
          category: item.category,
          tmdbId: !isNaN(tmdbIdMatch!) ? tmdbIdMatch : undefined,
        })
      );
      dispatch(showToast({ message: "Saved to your favorites", type: "success" }));
    } else {
      dispatch(showToast({ message: "Removed from favorites", type: "info" }));
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isFav}
      aria-label={isFav ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
      className={cn(
        "p-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
        isFav
          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 scale-105"
          : "bg-surface/80 text-text-muted hover:text-red-500 hover:bg-surface-elevated",
        className
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-transform duration-200",
          isFav ? "fill-red-500 stroke-red-500 scale-110" : "stroke-current"
        )}
      />
    </button>
  );
}
