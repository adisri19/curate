export type ContentType = "news" | "movie" | "social";

export interface Author {
  name: string;
  handle?: string;
  avatarUrl?: string;
}

export interface ContentItem {
  id: string; // globally unique, prefixed: "news:<hash>", "movie:<tmdbId>", "social:<id>"
  type: ContentType;
  title: string; // headline / movie title / post text first line
  description: string; // short summary (truncated safely)
  imageUrl: string | null;
  url: string; // external link for CTA
  source: string; // e.g. "BBC News", "TMDB", "@handle"
  category?: string; // news category or movie genre
  publishedAt: string; // ISO date
  popularity?: number; // used for Trending sorting
  hashtags?: string[]; // social tags
  author?: Author; // social author
}

export type FeedFilterType = "all" | ContentType;
