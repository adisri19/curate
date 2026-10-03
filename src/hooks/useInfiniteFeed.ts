"use client";

import { useState, useCallback, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetNewsQuery,
  useGetRecommendationsQuery,
  useGetSocialQuery,
} from "@/services/api";
import { ContentItem, FeedFilterType } from "@/types/content";
import { applyFeedOrder } from "@/store/slices/feedOrderSlice";
import { selectLatestMovieHistoryId } from "@/store/slices/historySlice";

export function useInfiniteFeed(filterType: FeedFilterType = "all") {
  const { categories, hashtags } = useAppSelector((state) => state.preferences);
  const customOrderIds = useAppSelector((state) => state.feedOrder.customOrderIds);
  const latestMovieId = useAppSelector(selectLatestMovieHistoryId);

  const [page, setPage] = useState(1);

  // Query News
  const shouldFetchNews = filterType === "all" || filterType === "news";
  const {
    data: newsData,
    error: newsError,
    isLoading: isNewsLoading,
    isFetching: isNewsFetching,
    refetch: refetchNews,
  } = useGetNewsQuery(
    {
      category: categories,
      page,
      pageSize: 8,
    },
    { skip: !shouldFetchNews }
  );

  // Query Recommendations (Movies)
  const shouldFetchMovies = filterType === "all" || filterType === "movie";
  const {
    data: moviesData,
    error: moviesError,
    isLoading: isMoviesLoading,
    isFetching: isMoviesFetching,
    refetch: refetchMovies,
  } = useGetRecommendationsQuery(
    {
      genres: categories,
      page,
      historyTmdbId: latestMovieId,
    },
    { skip: !shouldFetchMovies }
  );

  // Query Social
  const shouldFetchSocial = filterType === "all" || filterType === "social";
  const {
    data: socialData,
    error: socialError,
    isLoading: isSocialLoading,
    isFetching: isSocialFetching,
    refetch: refetchSocial,
  } = useGetSocialQuery(
    {
      hashtags,
      page,
      pageSize: 8,
    },
    { skip: !shouldFetchSocial }
  );

  // Interleave sources in a round-robin pattern
  const mergedItems = useMemo(() => {
    const news = newsData?.items || [];
    const movies = moviesData?.items || [];
    const social = socialData?.items || [];

    if (filterType === "news") return news;
    if (filterType === "movie") return movies;
    if (filterType === "social") return social;

    const result: ContentItem[] = [];
    const maxLen = Math.max(news.length, movies.length, social.length);
    const seenIds = new Set<string>();

    for (let i = 0; i < maxLen; i++) {
      if (i < news.length && !seenIds.has(news[i].id)) {
        result.push(news[i]);
        seenIds.add(news[i].id);
      }
      if (i < movies.length && !seenIds.has(movies[i].id)) {
        result.push(movies[i]);
        seenIds.add(movies[i].id);
      }
      if (i < social.length && !seenIds.has(social[i].id)) {
        result.push(social[i]);
        seenIds.add(social[i].id);
      }
    }

    return applyFeedOrder(customOrderIds, result);
  }, [filterType, newsData?.items, moviesData?.items, socialData?.items, customOrderIds]);

  const isInitialLoading =
    page === 1 &&
    ((shouldFetchNews && isNewsLoading) ||
      (shouldFetchMovies && isMoviesLoading) ||
      (shouldFetchSocial && isSocialLoading));

  const isFetchingMore =
    page > 1 &&
    ((shouldFetchNews && isNewsFetching) ||
      (shouldFetchMovies && isMoviesFetching) ||
      (shouldFetchSocial && isSocialFetching));

  const hasMore = Boolean(
    (shouldFetchNews && (newsData?.hasMore ?? true)) ||
      (shouldFetchMovies && (moviesData?.hasMore ?? true)) ||
      (shouldFetchSocial && (socialData?.hasMore ?? true))
  );

  const loadMore = useCallback(() => {
    if (!isFetchingMore && !isInitialLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetchingMore, isInitialLoading, hasMore]);

  const isDemo = Boolean(
    newsData?.isDemo || moviesData?.isDemo || socialData?.isDemo
  );

  return {
    items: mergedItems,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    isDemo,
    errors: {
      news: newsError,
      movies: moviesError,
      social: socialError,
    },
    refetch: {
      news: refetchNews,
      movies: refetchMovies,
      social: refetchSocial,
    },
  };
}
