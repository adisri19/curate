import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeMovieList } from "@/services/normalizers/movieNormalizer";
import { mockMovies } from "@/mocks/fixtures/movieFixtures";
import { mapCategoriesToTmdbGenreIds } from "@/lib/genreMapping";
import { env, isTmdbDemoMode } from "@/lib/env";

const querySchema = z.object({
  genres: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      // Could be genre IDs or category names
      const parts = val.split(",").map((p) => p.trim());
      const numeric = parts.filter((p) => /^\d+$/.test(p)).map(Number);
      const stringCategories = parts.filter((p) => !/^\d+$/.test(p));
      const mapped = mapCategoriesToTmdbGenreIds(stringCategories);
      return Array.from(new Set([...numeric, ...mapped]));
    }),
  q: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim().slice(0, 100) : "")),
  page: z.coerce.number().int().min(1).max(100).default(1),
  historyTmdbId: z.coerce.number().int().positive().optional(),
  trending: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1"),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = querySchema.safeParse(searchParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMETERS",
            message: "Validation failed for recommendations query parameters.",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { genres, q, page, historyTmdbId, trending } = parseResult.data;

    // Keyless Demo Mode or missing TMDB key
    if (isTmdbDemoMode) {
      let filtered = [...mockMovies];

      if (q) {
        const queryLower = q.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.title?.toLowerCase().includes(queryLower) ||
            m.overview?.toLowerCase().includes(queryLower)
        );
      } else if (trending) {
        // Sort by popularity desc
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      } else if (genres && genres.length > 0) {
        filtered = filtered.filter((m) =>
          m.genre_ids?.some((g) => genres.includes(g))
        );
        // If genre filter yields too few in demo mode, supplement with all demo movies
        if (filtered.length === 0) {
          filtered = [...mockMovies];
        }
      }

      const pageSize = 12;
      const startIndex = (page - 1) * pageSize;
      const paginated = filtered.slice(startIndex, startIndex + pageSize);
      const normalizedItems = normalizeMovieList(paginated);

      return NextResponse.json(
        {
          items: normalizedItems,
          page,
          pageSize,
          totalResults: filtered.length,
          hasMore: startIndex + pageSize < filtered.length,
          isDemo: true,
          source: "TMDB (Demo Fixtures)",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    // Live TMDB API
    const apiKey = env.TMDB_API_KEY;
    let tmdbUrl = new URL("https://api.tmdb.org/3/discover/movie");

    if (q) {
      tmdbUrl = new URL("https://api.tmdb.org/3/search/movie");
      tmdbUrl.searchParams.set("query", q);
    } else if (trending) {
      tmdbUrl = new URL("https://api.tmdb.org/3/trending/movie/day");
    } else if (historyTmdbId) {
      // User history personalization: recommendations based on last favorited/opened movie
      tmdbUrl = new URL(`https://api.tmdb.org/3/movie/${historyTmdbId}/recommendations`);
    } else {
      if (genres && genres.length > 0) {
        tmdbUrl.searchParams.set("with_genres", genres.join("|"));
      }
      tmdbUrl.searchParams.set("sort_by", "popularity.desc");
      tmdbUrl.searchParams.set("include_adult", "false");
    }

    tmdbUrl.searchParams.set("page", String(page));
    const isBearer = apiKey.startsWith("eyJ") || apiKey.length > 50;
    const reqHeaders: Record<string, string> = {
      Accept: "application/json",
    };
    if (isBearer) {
      reqHeaders["Authorization"] = `Bearer ${apiKey}`;
    } else {
      tmdbUrl.searchParams.set("api_key", apiKey);
    }

    let response: Response;
    try {
      response = await fetch(tmdbUrl.toString(), {
        headers: reqHeaders,
        next: { revalidate: 300 },
      });
    } catch (networkErr: unknown) {
      console.warn("TMDB upstream network/DNS reset, gracefully serving curated fixtures:", networkErr);
      const fallbackNormalized = normalizeMovieList(mockMovies);
      return NextResponse.json(
        {
          items: fallbackNormalized,
          page,
          pageSize: 12,
          totalResults: mockMovies.length,
          hasMore: false,
          isDemo: true,
          source: "TMDB (Fallback Fixtures)",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      return NextResponse.json(
        {
          error: {
            code: status === 429 ? "RATE_LIMITED" : "UPSTREAM_ERROR",
            message: errorData.status_message || `TMDB upstream error: ${response.statusText}`,
          },
        },
        { status: status === 429 ? 429 : 502 }
      );
    }

    const data = await response.json();
    const normalized = normalizeMovieList(data.results || []);

    return NextResponse.json(
      {
        items: normalized,
        page: data.page || page,
        pageSize: 20,
        totalResults: data.total_results || normalized.length,
        hasMore: (data.page || page) < (data.total_pages || 1),
        isDemo: false,
        source: "TMDB",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while fetching recommendations.";
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
