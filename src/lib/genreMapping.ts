import { CATEGORIES } from "./categories";

/**
 * Explicit mapping between Content Dashboard categories and The Movie Database (TMDB) genres.
 *
 * Rationale:
 * - technology: Map to Science Fiction (878) to surface tech/future/cyberpunk films.
 * - sports: Map to Documentary (99) to surface athletic profiles and sporting event documentaries.
 * - finance / business: Map to Drama (18) to surface corporate, market, and biopics.
 * - entertainment: Map to Comedy (35) for broad cinema appeal.
 * - health: Map to Documentary (99) to surface medical and lifestyle documentaries.
 * - science: Map to Science Fiction (878) or Documentary (99).
 * - general: Map to Action (28) for popular blockbuster content.
 */

export const CATEGORY_TO_TMDB_GENRE_MAP: Record<string, number> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.tmdbGenreId])
);

export const TMDB_GENRE_NAMES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

/**
 * Returns TMDB genre IDs for a given set of category strings.
 */
export function mapCategoriesToTmdbGenreIds(categories: string[]): number[] {
  const ids = categories
    .map((cat) => CATEGORY_TO_TMDB_GENRE_MAP[cat.toLowerCase()])
    .filter((id): id is number => typeof id === "number");

  return Array.from(new Set(ids));
}

/**
 * Get genre names from an array of TMDB genre IDs.
 */
export function getTmdbGenreNames(genreIds: number[] = []): string[] {
  return genreIds
    .map((id) => TMDB_GENRE_NAMES[id])
    .filter((name): name is string => Boolean(name));
}
