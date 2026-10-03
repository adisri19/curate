/**
 * Combines CSS class names filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Deterministic lightweight string hash for generating stable IDs.
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Creates a unique safe ID for news items based on url/title.
 */
export function createNewsId(url?: string, title?: string): string {
  const seed = url || title || Math.random().toString();
  return `news:${simpleHash(seed)}`;
}

/**
 * Sleep helper for delays / mock latency.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
