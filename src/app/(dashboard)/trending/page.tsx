"use client";

import React, { useState } from "react";
import {
  useGetNewsQuery,
  useGetRecommendationsQuery,
  useGetSocialQuery,
} from "@/services/api";
import { ContentCard } from "@/components/cards/ContentCard";
import { CardSkeleton } from "@/components/cards/CardSkeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { DemoBadge } from "@/components/states/DemoBadge";
import { Newspaper, Film, MessageSquare, Flame } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

export default function TrendingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const newsCategories = selectedCategory === "all" ? ["general", "technology"] : [selectedCategory];
  const movieGenres = selectedCategory === "all" ? [] : [selectedCategory];

  // Trending News
  const {
    data: newsData,
    isLoading: isNewsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useGetNewsQuery({
    category: newsCategories,
    page: 1,
    pageSize: 4,
  });

  // Trending Movies
  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useGetRecommendationsQuery({
    genres: movieGenres,
    trending: true,
    page: 1,
  });

  // Trending Social Posts
  const {
    data: socialData,
    isLoading: isSocialLoading,
    error: socialError,
    refetch: refetchSocial,
  } = useGetSocialQuery({
    trending: true,
    page: 1,
    pageSize: 4,
  });

  const isDemo = Boolean(newsData?.isDemo || moviesData?.isDemo || socialData?.isDemo);

  return (
    <div className="space-y-8">
      {/* Demo Banner */}
      <DemoBadge isDemoActive={isDemo} />

      {/* Page Header */}
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-1 font-medium">
          <span>Dashboard</span> <span className="mx-1">/</span> <span className="text-primary font-semibold">Trending</span>
        </nav>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            Trending Right Now
          </h1>
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500/20" />
        </div>
        <p className="text-sm text-text-muted mt-1 max-w-2xl">
          The most viral news updates, critically acclaimed films, and top-engaged social conversations across the globe.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
        <button
          role="tab"
          aria-selected={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-surface-elevated text-text-muted hover:text-text hover:bg-surface-hover border border-border"
          )}
        >
          All Topics
        </button>
        {CATEGORIES.slice(0, 6).map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-surface-elevated text-text-muted hover:text-text hover:bg-surface-hover border border-border"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending News Section */}
      <section aria-labelledby="trending-news-title" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Newspaper className="w-4 h-4" />
            </div>
            <h2 id="trending-news-title" className="text-lg font-bold text-text">
              Top Headlines
            </h2>
          </div>
          <span className="text-xs text-text-muted font-medium">Ranked by Recency</span>
        </div>

        {isNewsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {newsError && !isNewsLoading && (
          <ErrorState
            title="Failed to load trending news"
            message="Could not reach the headlines service."
            onRetry={refetchNews}
          />
        )}

        {newsData?.items && newsData.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsData.items.slice(0, 4).map((item, idx) => (
              <ContentCard key={item.id} item={item} index={idx} totalItems={4} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Movies Section */}
      <section aria-labelledby="trending-movies-title" className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Film className="w-4 h-4" />
            </div>
            <h2 id="trending-movies-title" className="text-lg font-bold text-text">
              Trending Cinema
            </h2>
          </div>
          <span className="text-xs text-text-muted font-medium">Popularity Score</span>
        </div>

        {isMoviesLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {moviesError && !isMoviesLoading && (
          <ErrorState
            title="Failed to load trending movies"
            message="Could not reach the recommendations service."
            onRetry={refetchMovies}
          />
        )}

        {moviesData?.items && moviesData.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {moviesData.items.slice(0, 4).map((item, idx) => (
              <ContentCard key={item.id} item={item} index={idx} totalItems={4} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Social Section */}
      <section aria-labelledby="trending-social-title" className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 id="trending-social-title" className="text-lg font-bold text-text">
              Viral Community Posts
            </h2>
          </div>
          <span className="text-xs text-text-muted font-medium">Ranked by Engagement</span>
        </div>

        {isSocialLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {socialError && !isSocialLoading && (
          <ErrorState
            title="Failed to load viral posts"
            message="Could not reach the community feed service."
            onRetry={refetchSocial}
          />
        )}

        {socialData?.items && socialData.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialData.items.slice(0, 4).map((item, idx) => (
              <ContentCard key={item.id} item={item} index={idx} totalItems={4} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
