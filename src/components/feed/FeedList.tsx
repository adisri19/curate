"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { DraggableCard } from "./DraggableCard";
import { DndWrapper } from "./DndWrapper";
import { CardSkeleton } from "@/components/cards/CardSkeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { DemoBadge } from "@/components/states/DemoBadge";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetOrder } from "@/store/slices/feedOrderSlice";
import { toggleSettingsDrawer } from "@/store/slices/uiSlice";
import { FeedFilterType } from "@/types/content";
import { RotateCcw, AlertTriangle, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const customOrderCount = useAppSelector((state) => state.feedOrder.customOrderIds.length);

  // Sync type filter from URL query param
  const rawType = searchParams.get("type");
  const activeType: FeedFilterType = ["news", "movie", "social"].includes(rawType || "")
    ? (rawType as FeedFilterType)
    : "all";

  const [announcement, setAnnouncement] = useState("");

  const {
    items,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    isDemo,
    errors,
    refetch,
  } = useInfiniteFeed(activeType);

  const { targetRef, isIntersecting } = useIntersectionObserver({
    enabled: hasMore && !isFetchingMore && !isInitialLoading,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !isFetchingMore) {
      loadMore();
    }
  }, [isIntersecting, hasMore, isFetchingMore, loadMore]);

  const handleTypeChange = (type: FeedFilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    router.push(`?${params.toString()}`);
  };

  const hasAnyErrors = Boolean(errors.news || errors.movies || errors.social);

  return (
    <DndWrapper>
      <div className="w-full space-y-6">
        {/* Keyless Demo Banner if active */}
        <DemoBadge isDemoActive={isDemo} />

        {/* Aria-live region for screen reader reorder announcements */}
        <div className="sr-only" aria-live="polite" role="status">
          {announcement}
        </div>

        {/* Filter Chips & Order Controls Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
          {/* Type Filters */}
          <div
            role="tablist"
            aria-label="Filter content by type"
            className="flex items-center gap-1.5 p-1 bg-surface-elevated/70 rounded-xl border border-border"
          >
            {(["all", "news", "movie", "social"] as const).map((type) => {
              const isActive = activeType === type;
              const labels = {
                all: "All Feeds",
                news: "News",
                movie: "Movies",
                social: "Social",
              };
              return (
                <button
                  key={type}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTypeChange(type)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-surface text-primary shadow-xs"
                      : "text-text-muted hover:text-text hover:bg-surface/50"
                  )}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

          {/* Reset Custom Order & Customize Preferences Actions */}
          <div className="flex items-center gap-2">
            {customOrderCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(resetOrder());
                  setAnnouncement("Feed order reset to default");
                }}
                className="text-xs gap-1.5"
                title="Reset custom card order"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Order
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(toggleSettingsDrawer())}
              className="text-xs gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Customize Feed
            </Button>
          </div>
        </div>

        {/* Partial Failure Warning Banner if one source failed while others succeeded */}
        {hasAnyErrors && items.length > 0 && (
          <div
            role="alert"
            className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Some content sources experienced an issue. Showing available feeds while attempting reconnection.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {errors.news && (
                <button
                  onClick={() => refetch.news()}
                  className="underline font-semibold hover:opacity-80"
                >
                  Retry News
                </button>
              )}
              {errors.movies && (
                <button
                  onClick={() => refetch.movies()}
                  className="underline font-semibold hover:opacity-80"
                >
                  Retry Movies
                </button>
              )}
              {errors.social && (
                <button
                  onClick={() => refetch.social()}
                  className="underline font-semibold hover:opacity-80"
                >
                  Retry Social
                </button>
              )}
            </div>
          </div>
        )}

        {/* Initial Loading Skeletons */}
        {isInitialLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Complete Failure State (zero items + error) */}
        {!isInitialLoading && items.length === 0 && hasAnyErrors && (
          <ErrorState
            title="Unable to load feed"
            message="We encountered an issue fetching your personalized content. Please verify your connection or retry."
            onRetry={() => {
              refetch.news();
              refetch.movies();
              refetch.social();
            }}
          />
        )}

        {/* Empty State (zero items + no error) */}
        {!isInitialLoading && items.length === 0 && !hasAnyErrors && (
          <EmptyState
            title="No content found"
            description="Try selecting different categories or hashtags in your preferences to surface new stories and films."
            actionLabel="Edit Preferences"
            onAction={() => dispatch(toggleSettingsDrawer())}
          />
        )}

        {/* Responsive Content Grid */}
        {!isInitialLoading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <DraggableCard
                key={item.id}
                item={item}
                index={index}
                totalItems={items.length}
                currentIds={items.map((i) => i.id)}
                onAnnounceMove={setAnnouncement}
              />
            ))}
          </div>
        )}

        {/* Pagination & Infinite Scroll Sentinel */}
        {!isInitialLoading && items.length > 0 && (
          <div className="pt-8 pb-12 flex flex-col items-center justify-center gap-4">
            {/* Sentinel for IntersectionObserver */}
            <div ref={targetRef} className="h-4 w-full pointer-events-none" />

            {/* Skeletons while fetching next page */}
            {isFetchingMore && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Fallback visible button for keyboard accessibility */}
            {hasMore && !isFetchingMore && (
              <Button
                variant="outline"
                size="md"
                onClick={loadMore}
                className="text-xs px-6 shadow-xs"
              >
                Load More Content
              </Button>
            )}

            {!hasMore && (
              <p className="text-xs font-medium text-text-muted py-4">
                You&apos;re all caught up! ✨ Check back later for fresh updates.
              </p>
            )}
          </div>
        )}
      </div>
    </DndWrapper>
  );
}
