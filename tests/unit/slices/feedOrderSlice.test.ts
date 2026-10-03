import { describe, it, expect } from "vitest";
import feedOrderReducer, {
  reorder,
  resetOrder,
  moveItemByStep,
  applyFeedOrder,
} from "@/store/slices/feedOrderSlice";
import { ContentItem } from "@/types/content";

const createMockItem = (id: string): ContentItem => ({
  id,
  type: "news",
  title: `Title ${id}`,
  description: `Desc ${id}`,
  imageUrl: null,
  url: "https://example.com",
  source: "Source",
  publishedAt: "2026-03-01T12:00:00Z",
});

describe("feedOrderSlice", () => {
  it("should reorder items fromIndex to toIndex", () => {
    const initialState = { customOrderIds: ["a", "b", "c", "d"] };
    const nextState = feedOrderReducer(
      initialState,
      reorder({ fromIndex: 0, toIndex: 2 })
    );

    // "a" moves to index 2: ["b", "c", "a", "d"]
    expect(nextState.customOrderIds).toEqual(["b", "c", "a", "d"]);
  });

  it("should move items up or down with moveItemByStep", () => {
    let state = { customOrderIds: ["a", "b", "c"] };
    state = feedOrderReducer(state, moveItemByStep({ id: "b", direction: "up" }));
    expect(state.customOrderIds).toEqual(["b", "a", "c"]);

    state = feedOrderReducer(state, moveItemByStep({ id: "b", direction: "down" }));
    expect(state.customOrderIds).toEqual(["a", "b", "c"]);
  });

  it("should reset custom order", () => {
    const initialState = { customOrderIds: ["a", "b"] };
    const nextState = feedOrderReducer(initialState, resetOrder());
    expect(nextState.customOrderIds).toEqual([]);
  });

  describe("applyFeedOrder merge strategy", () => {
    it("should return incoming items unmodified if custom order is empty", () => {
      const items = [createMockItem("1"), createMockItem("2")];
      const result = applyFeedOrder([], items);
      expect(result.map((i) => i.id)).toEqual(["1", "2"]);
    });

    it("should apply custom order for known items and append new incoming items in natural order", () => {
      const savedOrder = ["item-3", "item-1"];
      const incoming = [
        createMockItem("item-1"),
        createMockItem("item-2"),
        createMockItem("item-3"),
        createMockItem("item-4"),
      ];

      const ordered = applyFeedOrder(savedOrder, incoming);
      expect(ordered.map((i) => i.id)).toEqual([
        "item-3",
        "item-1",
        "item-2",
        "item-4",
      ]);
    });

    it("should gracefully ignore IDs in custom order that no longer exist in incoming items", () => {
      const savedOrder = ["stale-old-id", "item-2", "deleted-id"];
      const incoming = [createMockItem("item-1"), createMockItem("item-2")];

      const ordered = applyFeedOrder(savedOrder, incoming);
      expect(ordered.map((i) => i.id)).toEqual(["item-2", "item-1"]);
    });
  });
});
