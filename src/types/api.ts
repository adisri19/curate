import { ContentItem } from "./content";

export interface PaginatedResponse<T = ContentItem> {
  items: T[];
  page: number;
  pageSize: number;
  totalResults: number;
  hasMore: boolean;
  isDemo?: boolean;
  source?: string;
  category?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface FeedQueryParams {
  categories?: string[];
  hashtags?: string[];
  q?: string;
  page?: number;
  pageSize?: number;
  type?: "all" | "news" | "movie" | "social";
  historyTmdbId?: number;
}
