import { describe, it, expect } from "vitest";
import favoritesReducer, {
  toggleFavorite,
  clearFavorites,
  selectFavoritesList,
  selectFavoritesCount,
  selectIsFavorite,
} from "@/store/slices/favoritesSlice";
import { ContentItem } from "@/types/content";

const mockItem: ContentItem = {
  id: "news:test123",
  type: "news",
  title: "Test News Title",
  description: "Test news description",
  imageUrl: "https://example.com/image.jpg",
  url: "https://example.com/article",
  source: "BBC News",
  category: "technology",
  publishedAt: "2026-03-01T10:00:00Z",
};

describe("favoritesSlice", () => {
  it("should toggle an item into favorites as a full snapshot", () => {
    const initialState = { items: {} };
    const nextState = favoritesReducer(initialState, toggleFavorite(mockItem));

    expect(nextState.items[mockItem.id]).toBeDefined();
    expect(nextState.items[mockItem.id].title).toBe("Test News Title");
  });

  it("should toggle an existing item out of favorites", () => {
    const initialState = { items: { [mockItem.id]: mockItem } };
    const nextState = favoritesReducer(initialState, toggleFavorite(mockItem));

    expect(nextState.items[mockItem.id]).toBeUndefined();
    expect(Object.keys(nextState.items).length).toBe(0);
  });

  it("should clear all favorites", () => {
    const initialState = {
      items: {
        [mockItem.id]: mockItem,
        "movie:456": { ...mockItem, id: "movie:456", type: "movie" as const },
      },
    };
    const nextState = favoritesReducer(initialState, clearFavorites());
    expect(Object.keys(nextState.items).length).toBe(0);
  });

  it("should provide memoized selectors with count, list, and isFavorite", () => {
    const state = {
      favorites: {
        items: {
          [mockItem.id]: mockItem,
        },
      },
    };

    expect(selectFavoritesCount(state)).toBe(1);
    expect(selectIsFavorite(mockItem.id)(state)).toBe(true);
    expect(selectIsFavorite("news:nonexistent")(state)).toBe(false);

    const list = selectFavoritesList(state);
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(mockItem.id);
  });
});
