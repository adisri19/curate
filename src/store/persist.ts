import { UserPreferences } from "@/types/preferences";
import { ContentItem } from "@/types/content";
import { HistoryItem } from "@/types/preferences";
import { DEFAULT_PREFERENCES, VALID_CATEGORY_IDS } from "@/lib/categories";

export const PERSIST_STORAGE_KEY = "pcd:v1";
export const SCHEMA_VERSION = 1;

export interface PersistedState {
  version: number;
  preferences: UserPreferences;
  favorites: Record<string, ContentItem>;
  feedOrder: string[];
  history: HistoryItem[];
}

/**
 * Loads state safely from localStorage with corruption fallback and schema migration.
 */
export function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(PERSIST_STORAGE_KEY);
    if (!raw) return null;

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn("Corrupted JSON in localStorage, clearing key");
      localStorage.removeItem(PERSIST_STORAGE_KEY);
      return null;
    }

    if (!parsed || typeof parsed !== "object") {
      console.warn("Corrupted localStorage payload, clearing key");
      localStorage.removeItem(PERSIST_STORAGE_KEY);
      return null;
    }

    // Schema version check & migration
    if (parsed.version !== SCHEMA_VERSION) {
      console.warn(`Migrating persisted state from version ${parsed.version} to ${SCHEMA_VERSION}`);
    }

    // Sanitize preferences
    const rawPrefs = parsed.preferences || {};
    const sanitizedCategories = Array.isArray(rawPrefs.categories)
      ? rawPrefs.categories.filter((c: string) => VALID_CATEGORY_IDS.includes(c))
      : DEFAULT_PREFERENCES.categories;

    const preferences: UserPreferences = {
      categories: sanitizedCategories.length > 0 ? sanitizedCategories : DEFAULT_PREFERENCES.categories,
      hashtags: Array.isArray(rawPrefs.hashtags) ? rawPrefs.hashtags.slice(0, 10) : DEFAULT_PREFERENCES.hashtags,
      theme: ["light", "dark", "system"].includes(rawPrefs.theme) ? rawPrefs.theme : "system",
      language: typeof rawPrefs.language === "string" ? rawPrefs.language : "en",
    };

    // Sanitize favorites (must be object map of valid items)
    const favorites: Record<string, ContentItem> = {};
    if (parsed.favorites && typeof parsed.favorites === "object") {
      for (const [id, item] of Object.entries(parsed.favorites)) {
        if (item && typeof item === "object" && "id" in item && (item as { id: string }).id === id) {
          favorites[id] = item as ContentItem;
        }
      }
    }

    // Sanitize feedOrder
    const feedOrder = Array.isArray(parsed.feedOrder)
      ? parsed.feedOrder.filter((id: unknown): id is string => typeof id === "string")
      : [];

    // Sanitize history
    const history = Array.isArray(parsed.history) ? parsed.history.slice(0, 20) : [];

    return {
      version: SCHEMA_VERSION,
      preferences,
      favorites,
      feedOrder,
      history,
    };
  } catch (err) {
    console.error("Failed to load persisted state from localStorage:", err);
    return null;
  }
}

/**
 * Saves whitelisted state slices to localStorage.
 */
export function savePersistedState(state: {
  preferences: UserPreferences;
  favorites: { items: Record<string, ContentItem> };
  feedOrder: { customOrderIds: string[] };
  history: { items: HistoryItem[] };
}): void {
  if (typeof window === "undefined") return;

  try {
    const payload: PersistedState = {
      version: SCHEMA_VERSION,
      preferences: state.preferences,
      favorites: state.favorites.items,
      feedOrder: state.feedOrder.customOrderIds,
      history: state.history.items,
    };

    localStorage.setItem(PERSIST_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // QuotaExceededError or private browsing restrictions
    console.warn("Could not save state to localStorage:", err);
  }
}
