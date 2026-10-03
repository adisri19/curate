import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { server } from "./server";
import { makeStore } from "@/store/store";
import TrendingPage from "@/app/(dashboard)/trending/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/trending",
}));

describe("Trending Page Integration (MSW)", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders trending headlines, cinema, and viral community sections", async () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <TrendingPage />
      </Provider>
    );

    expect(screen.getByText("Trending Right Now")).toBeInTheDocument();
    expect(screen.getByText("Top Headlines")).toBeInTheDocument();
    expect(screen.getByText("Trending Cinema")).toBeInTheDocument();
    expect(screen.getByText("Viral Community Posts")).toBeInTheDocument();

    await waitFor(() => {
      const cards = screen.getAllByTestId("feed-card");
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("filters trending sections when category tab is selected", async () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <TrendingPage />
      </Provider>
    );

    const techTab = screen.getByRole("tab", { name: "Technology" });
    fireEvent.click(techTab);

    expect(techTab).toHaveAttribute("aria-selected", "true");
  });
});
