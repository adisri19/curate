import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeNewsList, RawNewsArticle } from "@/services/normalizers/newsNormalizer";
import { mockNewsArticles } from "@/mocks/fixtures/newsFixtures";
import { VALID_CATEGORY_IDS } from "@/lib/categories";
import { env, isNewsDemoMode } from "@/lib/env";

const querySchema = z.object({
  category: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((c) => c.trim().toLowerCase()) : []))
    .pipe(z.array(z.string().refine((c) => VALID_CATEGORY_IDS.includes(c), { message: "Invalid category" }))),
  q: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim().slice(0, 100) : "")),
  page: z.coerce.number().int().min(1).max(100).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
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
            message: "Validation failed for news query parameters.",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { category: categories, q, page, pageSize } = parseResult.data;
    const activeCategories = categories.length > 0 ? categories : ["general"];

    // Keyless Demo Mode or missing API Key
    if (isNewsDemoMode) {
      let filteredArticles: RawNewsArticle[] = [];

      if (q) {
        const queryLower = q.toLowerCase();
        // Search across all fixtures
        const allArticles = Object.values(mockNewsArticles).flat();
        filteredArticles = allArticles.filter(
          (a) =>
            a.title?.toLowerCase().includes(queryLower) ||
            a.description?.toLowerCase().includes(queryLower)
        );
      } else {
        // Collect articles from selected categories
        for (const cat of activeCategories) {
          const catArticles = mockNewsArticles[cat] || [];
          filteredArticles.push(...catArticles);
        }
      }

      // Deduplicate by URL
      const unique = Array.from(new Map(filteredArticles.map((a) => [a.url, a])).values());
      const startIndex = (page - 1) * pageSize;
      const paginatedSlice = unique.slice(startIndex, startIndex + pageSize);
      const normalizedItems = normalizeNewsList(paginatedSlice, activeCategories[0] || "general");

      return NextResponse.json(
        {
          items: normalizedItems,
          page,
          pageSize,
          totalResults: unique.length,
          hasMore: startIndex + pageSize < unique.length,
          isDemo: true,
          source: "NewsAPI (Demo Fixtures)",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360",
          },
        }
      );
    }

    // Live NewsAPI Fetching
    const apiKey = env.NEWSAPI_KEY;

    if (q) {
      // Search endpoint: /v2/everything
      const url = new URL("https://newsapi.org/v2/everything");
      url.searchParams.set("q", q);
      url.searchParams.set("page", String(page));
      url.searchParams.set("pageSize", String(pageSize));
      url.searchParams.set("language", "en");
      url.searchParams.set("sortBy", "relevancy");

      const response = await fetch(url.toString(), {
        headers: { "X-Api-Key": apiKey },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        return NextResponse.json(
          {
            error: {
              code: status === 429 ? "RATE_LIMITED" : "UPSTREAM_ERROR",
              message: errorData.message || `NewsAPI upstream error: ${response.statusText}`,
            },
          },
          { status: status === 429 ? 429 : 502 }
        );
      }

      const data = await response.json();
      const normalized = normalizeNewsList(data.articles || [], "search");
      return NextResponse.json(
        {
          items: normalized,
          page,
          pageSize,
          totalResults: data.totalResults || normalized.length,
          hasMore: page * pageSize < (data.totalResults || 0),
          isDemo: false,
          source: "NewsAPI",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    // Top headlines per category: /v2/top-headlines
    const perCatPageSize = Math.max(5, Math.ceil(pageSize / activeCategories.length));
    const results = await Promise.all(
      activeCategories.map(async (cat) => {
        try {
          const url = new URL("https://newsapi.org/v2/top-headlines");
          url.searchParams.set("category", cat === "finance" ? "business" : cat);
          url.searchParams.set("page", String(page));
          url.searchParams.set("pageSize", String(perCatPageSize));
          url.searchParams.set("language", "en");

          const response = await fetch(url.toString(), {
            headers: { "X-Api-Key": apiKey },
            next: { revalidate: 300 },
          });

          if (!response.ok) return [];
          const data = await response.json();
          return data.articles || [];
        } catch {
          return [];
        }
      })
    );

    const mergedRaw = results.flat();
    const normalizedItems = normalizeNewsList(mergedRaw, activeCategories[0] || "general");
    const startIndex = (page - 1) * pageSize;
    const paginated = normalizedItems.slice(0, pageSize);

    return NextResponse.json(
      {
        items: paginated,
        page,
        pageSize,
        totalResults: normalizedItems.length,
        hasMore: normalizedItems.length >= pageSize,
        isDemo: false,
        source: "NewsAPI",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred while fetching news.";
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
