import { http, HttpResponse } from "msw";
import { mockNewsArticles } from "./fixtures/newsFixtures";
import { mockMovies } from "./fixtures/movieFixtures";
import { mockSocialPosts } from "./fixtures/socialFixtures";
import { normalizeNewsList, RawNewsArticle } from "@/services/normalizers/newsNormalizer";
import { normalizeMovieList } from "@/services/normalizers/movieNormalizer";
import { normalizeSocialList } from "@/services/normalizers/socialNormalizer";

export const handlers = [
  http.get("*/api/news", ({ request }) => {
    const url = new URL(request.url);
    const categoryParam = url.searchParams.get("category");
    const q = url.searchParams.get("q");
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 12);

    const categories = categoryParam ? categoryParam.split(",").map((c) => c.trim()) : ["technology"];
    let articles: RawNewsArticle[] = [];

    if (q) {
      articles = Object.values(mockNewsArticles).flat().filter(
        (a) => a.title?.toLowerCase().includes(q.toLowerCase())
      );
    } else {
      for (const cat of categories) {
        articles.push(...(mockNewsArticles[cat] || []));
      }
    }

    const items = normalizeNewsList(articles.slice((page - 1) * pageSize, page * pageSize), categories[0]);
    return HttpResponse.json({
      items,
      page,
      pageSize,
      totalResults: articles.length,
      hasMore: page * pageSize < articles.length,
      isDemo: true,
      source: "MSW Mock News",
    });
  }),

  http.get("*/api/recommendations", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = 12;
    const q = url.searchParams.get("q");

    let movies = [...mockMovies];
    if (q) {
      movies = movies.filter((m) => m.title?.toLowerCase().includes(q.toLowerCase()));
    }

    const items = normalizeMovieList(movies.slice((page - 1) * pageSize, page * pageSize));
    return HttpResponse.json({
      items,
      page,
      pageSize,
      totalResults: movies.length,
      hasMore: page * pageSize < movies.length,
      isDemo: true,
      source: "MSW Mock Movies",
    });
  }),

  http.get("*/api/social", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 12);
    const q = url.searchParams.get("q");

    let posts = [...mockSocialPosts];
    if (q) {
      posts = posts.filter((p) => p.text.toLowerCase().includes(q.toLowerCase()));
    }

    const items = normalizeSocialList(posts.slice((page - 1) * pageSize, page * pageSize));
    return HttpResponse.json({
      items,
      page,
      pageSize,
      totalResults: posts.length,
      hasMore: page * pageSize < posts.length,
      isDemo: true,
      source: "MSW Mock Social",
    });
  }),
];
