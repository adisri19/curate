export interface CategoryDefinition {
  id: string;
  label: string;
  description: string;
  defaultHashtag: string;
  tmdbGenreId: number; // mapped TMDB genre id
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "technology",
    label: "Technology",
    description: "AI, gadgets, software engineering, and space tech",
    defaultHashtag: "technology",
    tmdbGenreId: 878, // Science Fiction
  },
  {
    id: "sports",
    label: "Sports",
    description: "Athletics, tournaments, fitness, and competitions",
    defaultHashtag: "sports",
    tmdbGenreId: 99, // Documentary (often sports documentaries)
  },
  {
    id: "finance",
    label: "Finance",
    description: "Markets, macroeconomics, crypto, and venture capital",
    defaultHashtag: "finance",
    tmdbGenreId: 18, // Drama (Wall Street / Finance dramas)
  },
  {
    id: "entertainment",
    label: "Entertainment",
    description: "Cinema, streaming, pop culture, and music",
    defaultHashtag: "entertainment",
    tmdbGenreId: 35, // Comedy
  },
  {
    id: "health",
    label: "Health",
    description: "Medicine, mental wellness, nutrition, and longevity",
    defaultHashtag: "health",
    tmdbGenreId: 99, // Documentary
  },
  {
    id: "science",
    label: "Science",
    description: "Physics, astronomy, biology, and climate science",
    defaultHashtag: "science",
    tmdbGenreId: 878, // Science Fiction
  },
  {
    id: "business",
    label: "Business",
    description: "Startups, leadership, corporate strategy, and economy",
    defaultHashtag: "business",
    tmdbGenreId: 18, // Drama
  },
  {
    id: "general",
    label: "General",
    description: "Top global headlines and breaking news",
    defaultHashtag: "news",
    tmdbGenreId: 28, // Action
  },
];

export const VALID_CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export const DEFAULT_PREFERENCES = {
  categories: ["technology", "sports", "finance"],
  hashtags: ["technology", "ai", "finance", "webdev"],
  theme: "system" as const,
  language: "en",
};
