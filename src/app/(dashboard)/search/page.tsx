"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetNewsQuery,
  useGetRecommendationsQuery,
  useGetSocialQuery,
} from "@/services/api";
import { ContentCard } from "@/components/cards/ContentCard";
import { CardSkeleton } from "@/components/cards/CardSkeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { ContentItem, FeedFilterType } from "@/types/content";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>("all");

  const isQueryValid = query.trim().length >= 2;

  // Search News
  const {
    data: newsData,
    isLoading: isNewsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useGetNewsQuery(
    { q: query, page: 1, pageSize: 12 },
    { skip: !isQueryValid }
  );

  // Search Movies
  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useGetRecommendationsQuery(
    { q: query, page: 1 },
    { skip: !isQueryValid }
  );

  // Search Social
  const {
    data: socialData,
    isLoading: isSocialLoading,
    error: socialError,
    refetch: refetchSocial,
  } = useGetSocialQuery(
    { q: query, page: 1, pageSize: 12 },
    { skip: !isQueryValid }
  );

  const isLoading =
    isQueryValid && (isNewsLoading || isMoviesLoading || isSocialLoading);

  const allItems: ContentItem[] = [
    ...(newsData?.items || []),
    ...(moviesData?.items || []),
    ...(socialData?.items || []),
  ];

  const filteredItems = allItems.filter((item) =>
    activeFilter === "all" ? true : item.type === activeFilter
  );

  return (
    <div className="space-y-6">
      {/* Search Page Header */}
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-1 font-medium">
          <span>Dashboard</span> <span className="mx-1">/</span> <span className="text-primary font-semibold">Search</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
          {query ? `Search Results for "${query}"` : "Search Everything"}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Simultaneous multi-source search across global news, cinema catalogs, and social discussions.
        </p>
      </div>

      {/* Idle Prompt State when no query is typed */}
      {!isQueryValid && (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-surface/40 max-w-lg mx-auto my-8">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-base font-semibold text-text mb-1">
            Type at least 2 characters to search
          </h2>
          <p className="text-xs text-text-muted max-w-sm">
            Discover breaking articles, search movies on TMDB, or find community discussions by keyword or topic.
          </p>
        </div>
      )}

      {/* Filter Chips when query is active */}
      {isQueryValid && (
        <div className="flex items-center gap-1.5 p-1 bg-surface-elevated/70 rounded-xl border border-border w-fit">
          {(["all", "news", "movie", "social"] as const).map((type) => {
            const count =
              type === "all"
                ? allItems.length
                : allItems.filter((i) => i.type === type).length;
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
                {!isLoading && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border text-text-muted">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && isQueryValid && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              index={index}
              totalItems={filteredItems.length}
            />
          ))}
        </div>
      )}

      {/* No Results Empty State */}
      {!isLoading && isQueryValid && allItems.length === 0 && (
        <EmptyState
          title={`No results for "${query}"`}
          description="We couldn't find any news articles, movies, or social posts matching your keyword. Try a different search term or check spelling."
          icon={<Search className="w-8 h-8 text-text-muted stroke-[1.5]" />}
        />
      )}
    </div>
  );
}
