import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ContentItem } from "@/types/content";
import { PaginatedResponse } from "@/types/api";

export interface NewsQueryArgs {
  category?: string[];
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface RecommendationsQueryArgs {
  genres?: string[];
  q?: string;
  page?: number;
  historyTmdbId?: number;
  trending?: boolean;
}

export interface SocialQueryArgs {
  hashtags?: string[];
  q?: string;
  page?: number;
  pageSize?: number;
  trending?: boolean;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null") {
    return `${window.location.origin}/api`;
  }
  return "http://localhost:3000/api";
};

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  tagTypes: ["News", "Recommendations", "Social"],
  endpoints: (builder) => ({
    getNews: builder.query<PaginatedResponse<ContentItem>, NewsQueryArgs>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.category && args.category.length > 0) {
          params.set("category", args.category.join(","));
        }
        if (args.q) params.set("q", args.q);
        if (args.page) params.set("page", String(args.page));
        if (args.pageSize) params.set("pageSize", String(args.pageSize));
        return `news?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const catKey = queryArgs.category ? [...queryArgs.category].sort().join(",") : "";
        return `${endpointName}-${catKey}-${queryArgs.q || ""}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.page || arg.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.items.map((i) => i.id));
        for (const item of newItems.items) {
          if (!existingIds.has(item.id)) {
            currentCache.items.push(item);
          }
        }
        currentCache.page = newItems.page;
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "News" as const, id })),
              { type: "News", id: "LIST" },
            ]
          : [{ type: "News", id: "LIST" }],
    }),

    getRecommendations: builder.query<PaginatedResponse<ContentItem>, RecommendationsQueryArgs>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.genres && args.genres.length > 0) {
          params.set("genres", args.genres.join(","));
        }
        if (args.q) params.set("q", args.q);
        if (args.page) params.set("page", String(args.page));
        if (args.historyTmdbId) params.set("historyTmdbId", String(args.historyTmdbId));
        if (args.trending) params.set("trending", "true");
        return `recommendations?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const genreKey = queryArgs.genres ? [...queryArgs.genres].sort().join(",") : "";
        return `${endpointName}-${genreKey}-${queryArgs.q || ""}-${queryArgs.trending ? "trending" : ""}-${queryArgs.historyTmdbId || ""}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.page || arg.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.items.map((i) => i.id));
        for (const item of newItems.items) {
          if (!existingIds.has(item.id)) {
            currentCache.items.push(item);
          }
        }
        currentCache.page = newItems.page;
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Recommendations" as const, id })),
              { type: "Recommendations", id: "LIST" },
            ]
          : [{ type: "Recommendations", id: "LIST" }],
    }),

    getSocial: builder.query<PaginatedResponse<ContentItem>, SocialQueryArgs>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.hashtags && args.hashtags.length > 0) {
          params.set("hashtags", args.hashtags.join(","));
        }
        if (args.q) params.set("q", args.q);
        if (args.page) params.set("page", String(args.page));
        if (args.pageSize) params.set("pageSize", String(args.pageSize));
        if (args.trending) params.set("trending", "true");
        return `social?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const tagsKey = queryArgs.hashtags ? [...queryArgs.hashtags].sort().join(",") : "";
        return `${endpointName}-${tagsKey}-${queryArgs.q || ""}-${queryArgs.trending ? "trending" : ""}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.page || arg.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.items.map((i) => i.id));
        for (const item of newItems.items) {
          if (!existingIds.has(item.id)) {
            currentCache.items.push(item);
          }
        }
        currentCache.page = newItems.page;
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Social" as const, id })),
              { type: "Social", id: "LIST" },
            ]
          : [{ type: "Social", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useLazyGetNewsQuery,
  useGetRecommendationsQuery,
  useLazyGetRecommendationsQuery,
  useGetSocialQuery,
  useLazyGetSocialQuery,
} = contentApi;
