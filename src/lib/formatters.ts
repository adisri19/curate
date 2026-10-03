/**
 * Strips HTML tags and decodes basic entities to safely render external text.
 */
export function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Truncates text safely at word boundary with an ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  const sub = text.slice(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.75) {
    return `${sub.slice(0, lastSpace)}...`;
  }
  return `${sub}...`;
}

/**
 * Validates and sanitizes external URLs to strictly permit http and https protocols.
 */
export function sanitizeExternalUrl(url?: string | null, fallback: string | null = "#"): string | null {
  if (!url) return fallback;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Formats an ISO date string into human-friendly relative time.
 */
export function formatRelativeTime(isoDate?: string | null): string {
  if (!isoDate) return "recently";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "recently";

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 45) return "just now";
  if (diffSec < 3600) {
    const min = Math.max(1, Math.floor(diffSec / 60));
    return `${min}m ago`;
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours}h ago`;
  }
  if (diffSec < 172800) {
    return "yesterday";
  }
  const days = Math.floor(diffSec / 86400);
  if (days < 30) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Normalizes hashtag: removes leading #, strips whitespace, converts to lowercase, max 30 chars.
 */
export function normalizeHashtag(tag: string): string {
  return tag
    .replace(/^#+/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
}
