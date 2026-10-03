import { describe, it, expect } from "vitest";
import historyReducer, {
  recordHistory,
  clearHistory,
  selectLatestMovieHistoryId,
} from "@/store/slices/historySlice";

describe("historySlice", () => {
  it("should record an item to history", () => {
    const initialState = { items: [] };
    const nextState = historyReducer(
      initialState,
      recordHistory({ id: "news:123", type: "news", category: "technology" })
    );

    expect(nextState.items.length).toBe(1);
    expect(nextState.items[0].id).toBe("news:123");
  });

  it("should move an existing item to the front when re-opened", () => {
    const initialState = {
      items: [
        { id: "movie:1", type: "movie" as const, timestamp: "2026-01-01T00:00:00Z" },
        { id: "news:2", type: "news" as const, timestamp: "2026-01-01T00:00:00Z" },
      ],
    };

    const nextState = historyReducer(
      initialState,
      recordHistory({ id: "news:2", type: "news" })
    );

    expect(nextState.items.length).toBe(2);
    expect(nextState.items[0].id).toBe("news:2");
  });

  it("should truncate history to a maximum of 20 items", () => {
    let state: { items: any[] } = { items: [] };
    for (let i = 1; i <= 25; i++) {
      state = historyReducer(
        state,
        recordHistory({ id: `item:${i}`, type: "social" })
      );
    }

    expect(state.items.length).toBe(20);
    expect(state.items[0].id).toBe("item:25");
  });

  it("should retrieve the latest movie TMDB ID for recommendation personalization", () => {
    const state = {
      history: {
        items: [
          { id: "social:1", type: "social" as const, timestamp: "2026-01-01" },
          { id: "movie:693134", type: "movie" as const, tmdbId: 693134, timestamp: "2026-01-01" },
          { id: "movie:157336", type: "movie" as const, tmdbId: 157336, timestamp: "2026-01-01" },
        ],
      },
    };

    expect(selectLatestMovieHistoryId(state)).toBe(693134);
  });

  it("should clear history when clearHistory is dispatched", () => {
    const populated = {
      items: [{ id: "news:1", type: "news" as const, timestamp: "2026-01-01" }],
    };
    const cleared = historyReducer(populated, clearHistory());
    expect(cleared.items).toEqual([]);
  });
});
