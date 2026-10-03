import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import FavoritesPage from "@/app/(dashboard)/favorites/page";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { savePersistedState, loadPersistedState } from "@/store/persist";
import { ContentItem } from "@/types/content";

const mockItem: ContentItem = {
  id: "news:persist-test-1",
  type: "news",
  title: "Persistent News Headline",
  description: "Description of the persistent article",
  imageUrl: "https://example.com/img.jpg",
  url: "https://example.com/article",
  source: "BBC News",
  category: "technology",
  publishedAt: "2026-03-01T10:00:00Z",
};

describe("Favorites Integration & Rehydration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reflects favorites after reload by re-hydrating from localStorage", () => {
    // 1. First session: add favorite and save state
    const store1 = makeStore();
    store1.dispatch(toggleFavorite(mockItem));

    const state1 = store1.getState();
    savePersistedState({
      preferences: state1.preferences,
      favorites: state1.favorites,
      feedOrder: state1.feedOrder,
      history: state1.history,
    });

    // 2. Second session (simulating page reload): re-hydrate from localStorage
    const persisted = loadPersistedState();
    expect(persisted).not.toBeNull();
    expect(persisted?.favorites[mockItem.id]).toBeDefined();

    const store2 = makeStore({
      favorites: { items: persisted!.favorites },
    });

    render(
      <Provider store={store2}>
        <FavoritesPage />
      </Provider>
    );

    expect(screen.getByText("Persistent News Headline")).toBeInTheDocument();
    expect(screen.getByText("BBC News")).toBeInTheDocument();
  });

  it("unfavorites item immediately when unfavorited", () => {
    const store = makeStore({
      favorites: { items: { [mockItem.id]: mockItem } },
    });

    render(
      <Provider store={store}>
        <FavoritesPage />
      </Provider>
    );

    expect(screen.getByText("Persistent News Headline")).toBeInTheDocument();

    const unfavBtn = screen.getByRole("button", {
      name: /Remove Persistent News Headline from favorites/i,
    });
    fireEvent.click(unfavBtn);

    expect(screen.queryByText("Persistent News Headline")).not.toBeInTheDocument();
    expect(screen.getByText("No favorites saved yet")).toBeInTheDocument();
  });
});
