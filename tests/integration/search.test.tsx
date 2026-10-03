import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { server } from "./server";
import { makeStore } from "@/store/store";
import SearchPage from "@/app/(dashboard)/search/page";

const mockSearchParams = new URLSearchParams("q=quantum");

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/search",
}));

describe("Search Integration Tests (MSW)", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("fetches and displays search results across sources for a query", async () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <SearchPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Search Results for "quantum"/i)).toBeInTheDocument();
      const cards = screen.getAllByTestId("feed-card");
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("displays no-results state when search yields zero matches across all sources", async () => {
    server.use(
      http.get("*/api/news", () => HttpResponse.json({ items: [], page: 1, hasMore: false, totalResults: 0 })),
      http.get("*/api/recommendations", () => HttpResponse.json({ items: [], page: 1, hasMore: false, totalResults: 0 })),
      http.get("*/api/social", () => HttpResponse.json({ items: [], page: 1, hasMore: false, totalResults: 0 }))
    );

    const store = makeStore();
    render(
      <Provider store={store}>
        <SearchPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No results for "quantum"/i)).toBeInTheDocument();
    });
  });
});
