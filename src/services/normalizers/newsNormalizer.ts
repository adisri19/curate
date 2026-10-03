import { ContentItem } from "@/types/content";
import { createNewsId } from "@/lib/utils";
import { stripHtml, sanitizeExternalUrl } from "@/lib/formatters";

export interface RawNewsArticle {
  source?: { id?: string | null; name?: string | null };
  author?: string | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  content?: string | null;
}

export function normalizeNewsArticle(
  article: RawNewsArticle,
  category = "general"
): ContentItem | null {
  if (!article) return null;

  const rawTitle = article.title ? stripHtml(article.title) : "";
  // NewsAPI flags deleted/purged articles with [Removed]
  if (!rawTitle || rawTitle.trim() === "[Removed]" || rawTitle.startsWith("[Removed]")) {
    return null;
  }

  const rawDesc = article.description ? stripHtml(article.description) : "";
  if (rawDesc.trim() === "[Removed]") {
    return null;
  }

  const validUrl = sanitizeExternalUrl(article.url, null);
  if (!validUrl) {
    return null; // External link required for news CTA
  }

  const id = createNewsId(validUrl, rawTitle);
  const sourceName = article.source?.name ? stripHtml(article.source.name) : "News";
  const validImageUrl = article.urlToImage ? sanitizeExternalUrl(article.urlToImage, null) : null;

  return {
    id,
    type: "news",
    title: rawTitle,
    description: rawDesc || "No description provided for this article.",
    imageUrl: validImageUrl,
    url: validUrl,
    source: sourceName,
    category,
    publishedAt: article.publishedAt || new Date().toISOString(),
    popularity: 50, // default baseline
  };
}

export function normalizeNewsList(
  articles: RawNewsArticle[] = [],
  category = "general"
): ContentItem[] {
  const seenIds = new Set<string>();
  const normalized: ContentItem[] = [];

  for (const article of articles) {
    const item = normalizeNewsArticle(article, category);
    if (item && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      normalized.push(item);
    }
  }

  return normalized;
}
