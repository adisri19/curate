"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFavoritesList,
  clearFavorites,
  toggleFavorite,
} from "@/store/slices/favoritesSlice";
import { showToast } from "@/store/slices/uiSlice";
import { ContentCard } from "@/components/cards/ContentCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ContentItem, FeedFilterType } from "@/types/content";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const allFavorites = useAppSelector(selectFavoritesList);
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredFavorites = allFavorites.filter((item) =>
    activeFilter === "all" ? true : item.type === activeFilter
  );

  const handleClearAll = () => {
    dispatch(clearFavorites());
    setShowClearConfirm(false);
    dispatch(
      showToast({
        message: "All favorites have been cleared.",
        type: "info",
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-1 font-medium">
            <span>Dashboard</span> <span className="mx-1">/</span> <span className="text-primary font-semibold">Favorites</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
              Saved Favorites
            </h1>
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
          <p className="text-sm text-text-muted mt-1">
            Offline-persisted collection of your saved articles, movies, and community posts.
          </p>
        </div>

        {allFavorites.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs text-danger hover:bg-danger/10 hover:border-danger/30 gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Chips if favorites exist */}
      {allFavorites.length > 0 && (
        <div className="flex items-center gap-1.5 p-1 bg-surface-elevated/70 rounded-xl border border-border w-fit">
          {(["all", "news", "movie", "social"] as const).map((type) => {
            const count =
              type === "all"
                ? allFavorites.length
                : allFavorites.filter((f) => f.type === type).length;
            const isActive = activeFilter === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveFilter(type)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center gap-1.5",
                  isActive
                    ? "bg-surface text-primary shadow-xs"
                    : "text-text-muted hover:text-text hover:bg-surface/50"
                )}
              >
                <span>{type === "all" ? "All" : type}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border text-text-muted">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Favorites Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              index={index}
              totalItems={filteredFavorites.length}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={allFavorites.length === 0 ? "No favorites saved yet" : `No ${activeFilter} favorites`}
          description={
            allFavorites.length === 0
              ? "Click the heart icon on any headline, film, or social post to save it for offline reading anytime."
              : `You haven't saved any items under the "${activeFilter}" category.`
          }
          actionLabel="Explore Feed"
          onAction={() => {}}
          icon={<Heart className="w-8 h-8 text-red-500 stroke-[1.5]" />}
        />
      )}

      {/* Clear All Confirmation Dialog */}
      <Dialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear all saved favorites?"
        description="This will permanently remove all articles, movies, and social posts from your offline collection."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
          >
            Yes, Clear All
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
