import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeSocialList } from "@/services/normalizers/socialNormalizer";
import { mockSocialPosts } from "@/mocks/fixtures/socialFixtures";
import { env } from "@/lib/env";
import { sleep } from "@/lib/utils";

const querySchema = z.object({
  hashtags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((t) => t.trim().toLowerCase().replace(/^#+/, "")) : [])),
  q: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim().slice(0, 100) : "")),
  page: z.coerce.number().int().min(1).max(100).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
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
            message: "Validation failed for social query parameters.",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { hashtags, q, page, pageSize, trending } = parseResult.data;

    // Simulate realistic 200-500ms network latency
    const randomLatency = Math.floor(Math.random() * 300) + 200;
    await sleep(randomLatency);

    // Optional simulated failure rate for resilience testing
    if (env.SOCIAL_MOCK_FAILURE_RATE > 0 && Math.random() < env.SOCIAL_MOCK_FAILURE_RATE) {
      return NextResponse.json(
        {
          error: {
            code: "SOCIAL_UPSTREAM_FAILURE",
            message: "Simulated upstream failure in social mock service.",
          },
        },
        { status: 503 }
      );
    }

    let filtered = [...mockSocialPosts];

    if (q) {
      const queryLower = q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.text.toLowerCase().includes(queryLower) ||
          p.author.name.toLowerCase().includes(queryLower) ||
          p.author.handle.toLowerCase().includes(queryLower) ||
          p.hashtags?.some((h) => h.toLowerCase().includes(queryLower))
      );
    } else if (trending) {
      // Sort by engagement (likes + 2 * retweets)
      filtered.sort((a, b) => (b.likes || 0) + (b.retweets || 0) * 2 - ((a.likes || 0) + (a.retweets || 0) * 2));
    } else if (hashtags && hashtags.length > 0) {
      const activeTags = hashtags.map((h) => h.toLowerCase());
      filtered = filtered.filter((p) =>
        p.hashtags?.some((tag) => activeTags.includes(tag.toLowerCase()))
      );
      // If specific tags yield too few, backfill with general posts
      if (filtered.length < pageSize) {
        const remaining = mockSocialPosts.filter((p) => !filtered.some((f) => f.id === p.id));
        filtered = [...filtered, ...remaining];
      }
    }

    const totalResults = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedSlice = filtered.slice(startIndex, startIndex + pageSize);
    const normalizedItems = normalizeSocialList(paginatedSlice);

    return NextResponse.json(
      {
        items: normalizedItems,
        page,
        pageSize,
        totalResults,
        hasMore: startIndex + pageSize < totalResults,
        isDemo: true,
        source: "Social Feed (Mock API)",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred while processing social feed.";
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
