export type ThemeMode = "light" | "dark" | "system";

export interface UserPreferences {
  categories: string[];
  hashtags: string[];
  theme: ThemeMode;
  language: string;
}

export interface HistoryItem {
  id: string;
  type: "news" | "movie" | "social";
  category?: string;
  timestamp: string;
  tmdbId?: number;
}
