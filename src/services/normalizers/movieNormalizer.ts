import { ContentItem } from "@/types/content";
import { stripHtml } from "@/lib/formatters";
import { getTmdbGenreNames } from "@/lib/genreMapping";

export interface RawTmdbMovie {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
}

export function normalizeMovie(movie: RawTmdbMovie): ContentItem | null {
  if (!movie || !movie.id) return null;

  const title = stripHtml(movie.title || movie.original_title || "Untitled Film");
  const overview = stripHtml(movie.overview || "No overview available.");

  const imagePath = movie.poster_path || movie.backdrop_path;
  const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : null;
  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;

  const genreIds = movie.genre_ids || (movie.genres ? movie.genres.map((g) => g.id) : []);
  const genreNames = getTmdbGenreNames(genreIds);
  const primaryGenre = genreNames[0] || "Film";

  return {
    id: `movie:${movie.id}`,
    type: "movie",
    title,
    description: overview,
    imageUrl,
    url: tmdbUrl,
    source: "TMDB",
    category: primaryGenre,
    publishedAt: movie.release_date
      ? new Date(movie.release_date).toISOString()
      : new Date().toISOString(),
    popularity: movie.popularity ? Math.round(movie.popularity) : Math.round((movie.vote_average || 5) * 10),
  };
}

export function normalizeMovieList(movies: RawTmdbMovie[] = []): ContentItem[] {
  const seenIds = new Set<string>();
  const normalized: ContentItem[] = [];

  for (const movie of movies) {
    const item = normalizeMovie(movie);
    if (item && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      normalized.push(item);
    }
  }

  return normalized;
}
