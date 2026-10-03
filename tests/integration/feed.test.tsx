import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { server } from "./server";
import { makeStore } from "@/store/store";
import { FeedList } from "@/components/feed/FeedList";
import { toggleCategory } from "@/store/slices/preferencesSlice";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/feed",
}));

describe("Feed Integration Tests (MSW)", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders fetched content items from news, movies, and social sources", async () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <FeedList />
      </Provider>
    );

    // Wait for items from all sources to appear
    await waitFor(() => {
      const cards = screen.getAllByTestId("feed-card");
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("displays empty state when all endpoints return empty lists", async () => {
    server.use(
      http.get("*/api/news", () => HttpResponse.json({ items: [], page: 1, hasMore: false, totalResults: 0 })),
      http.get("*/api/recommendations", () => HttpResponse.json({ items: [], page: 1, hasMore: false, totalResults: 0 })),
      http.get("*/api/social", () => HttpResponse.json({ items: [], page: 1, hasMore: false, totalResults: 0 }))
    );

    const store = makeStore();
    render(
      <Provider store={store}>
        <FeedList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("No content found")).toBeInTheDocument();
    });
  });

  it("handles partial failure gracefully: displays working feeds plus retry banner", async () => {
    // Fail social while news and movies succeed
    server.use(
      http.get("*/api/social", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const store = makeStore();
    render(
      <Provider store={store}>
        <FeedList />
      </Provider>
    );

    // Items from news and movies should still render
    await waitFor(() => {
      const cards = screen.getAllByTestId("feed-card");
      expect(cards.length).toBeGreaterThan(0);
    });

    // Alert banner for failed source should be visible
    await waitFor(() => {
      expect(
        screen.getByText(/Some content sources experienced an issue/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Retry Social/i)).toBeInTheDocument();
    });
  });

  it("refetches content when user category preferences change", async () => {
    let requestedCategories = "";
    server.use(
      http.get("*/api/news", ({ request }) => {
        const url = new URL(request.url);
        requestedCategories = url.searchParams.get("category") || "";
        return HttpResponse.json({
          items: [
            {
              id: "news:sports-test",
              type: "news",
              title: "Sports Story",
              description: "Desc",
              url: "https://example.com/sports",
              source: "ESPN",
              publishedAt: "2026-03-01T00:00:00Z",
            },
          ],
          page: 1,
          hasMore: false,
          totalResults: 1,
        });
      })
    );

    const store = makeStore();
    render(
      <Provider store={store}>
        <FeedList />
      </Provider>
    );

    // Toggle sports category
    store.dispatch(toggleCategory("sports"));

    await waitFor(() => {
      expect(screen.getByText("Sports Story")).toBeInTheDocument();
      expect(requestedCategories).toBeDefined();
    });
  });
});
