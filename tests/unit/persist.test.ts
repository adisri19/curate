import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadPersistedState,
  savePersistedState,
  PERSIST_STORAGE_KEY,
} from "@/store/persist";

describe("localStorage persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return null if localStorage is empty", () => {
    expect(loadPersistedState()).toBeNull();
  });

  it("should handle corrupted non-JSON data safely without crashing", () => {
    localStorage.setItem(PERSIST_STORAGE_KEY, "invalid-json{{[");
    expect(loadPersistedState()).toBeNull();
    // Corrupted key should be cleaned up
    expect(localStorage.getItem(PERSIST_STORAGE_KEY)).toBeNull();
  });

  it("should sanitize and filter invalid categories when loading state", () => {
    const corruptedState = {
      version: 1,
      preferences: {
        categories: ["technology", "malicious_fake_category"],
        hashtags: ["ai"],
        theme: "dark",
        language: "en",
      },
      favorites: {},
      feedOrder: [],
      history: [],
    };

    localStorage.setItem(PERSIST_STORAGE_KEY, JSON.stringify(corruptedState));
    const loaded = loadPersistedState();

    expect(loaded).not.toBeNull();
    expect(loaded?.preferences.categories).toEqual(["technology"]);
    expect(loaded?.preferences.categories).not.toContain("malicious_fake_category");
  });

  it("should save whitelisted slices to localStorage correctly", () => {
    const mockState = {
      preferences: {
        categories: ["technology", "sports"],
        hashtags: ["ai"],
        theme: "dark" as const,
        language: "en",
      },
      favorites: {
        items: {
          "news:123": {
            id: "news:123",
            type: "news" as const,
            title: "Saved Article",
            description: "Desc",
            imageUrl: null,
            url: "https://example.com",
            source: "Source",
            publishedAt: "2026-03-01T00:00:00Z",
          },
        },
      },
      feedOrder: {
        customOrderIds: ["news:123"],
      },
      history: {
        items: [],
      },
    };

    savePersistedState(mockState);

    const savedRaw = localStorage.getItem(PERSIST_STORAGE_KEY);
    expect(savedRaw).not.toBeNull();

    const loaded = loadPersistedState();
    expect(loaded?.preferences.categories).toEqual(["technology", "sports"]);
    expect(loaded?.favorites["news:123"]?.title).toBe("Saved Article");
    expect(loaded?.feedOrder).toEqual(["news:123"]);
  });

  it("should handle QuotaExceededError or disabled storage gracefully without throwing", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() =>
      savePersistedState({
        preferences: { categories: ["technology"], hashtags: [], theme: "system", language: "en" },
        favorites: { items: {} },
        feedOrder: { customOrderIds: [] },
        history: { items: [] },
      })
    ).not.toThrow();

    setItemSpy.mockRestore();
  });
});
