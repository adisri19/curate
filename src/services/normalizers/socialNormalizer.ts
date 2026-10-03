import { ContentItem } from "@/types/content";
import { stripHtml } from "@/lib/formatters";

export interface RawSocialPost {
  id: string | number;
  text: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  hashtags?: string[];
  imageUrl?: string | null;
  createdAt: string;
  likes?: number;
  retweets?: number;
}

export function normalizeSocialPost(post: RawSocialPost): ContentItem | null {
  if (!post || !post.id || !post.text) return null;

  const text = stripHtml(post.text);
  const firstLine = text.split("\n")[0] || text;
  const title = firstLine.length > 90 ? `${firstLine.slice(0, 90)}...` : firstLine;

  const id = `social:${post.id}`;
  const authorName = stripHtml(post.author?.name || "Anonymous");
  const authorHandle = post.author?.handle ? post.author.handle.replace(/^@*/, "@") : "@user";

  const hashtags = (post.hashtags || []).map((t) => t.replace(/^#+/, "").toLowerCase());
  const engagement = (post.likes || 0) + (post.retweets || 0) * 2;

  return {
    id,
    type: "social",
    title,
    description: text,
    imageUrl: post.imageUrl || null,
    url: `https://x.com/search?q=%23${encodeURIComponent(hashtags[0] || "tech")}&f=live`,
    source: authorHandle,
    category: hashtags[0] || "social",
    publishedAt: post.createdAt || new Date().toISOString(),
    popularity: engagement,
    hashtags,
    author: {
      name: authorName,
      handle: authorHandle,
      avatarUrl: post.author?.avatarUrl,
    },
  };
}

export function normalizeSocialList(posts: RawSocialPost[] = []): ContentItem[] {
  const seenIds = new Set<string>();
  const normalized: ContentItem[] = [];

  for (const post of posts) {
    const item = normalizeSocialPost(post);
    if (item && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      normalized.push(item);
    }
  }

  return normalized;
}
