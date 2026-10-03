import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/feed",
}));

describe("Layout Components", () => {
  it("renders Header with search bar, theme toggle, and user profile", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Search news, movies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /User profile menu/i })).toBeInTheDocument();
  });

  it("renders Sidebar with brand logo and main navigation links", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    expect(screen.getByText("Curate")).toBeInTheDocument();
    expect(screen.getByText("My Feed")).toBeInTheDocument();
    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Customize Feed")).toBeInTheDocument();
  });

  it("opens settings drawer when clicking Customize Feed in sidebar", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    const customizeBtn = screen.getByRole("button", { name: /Customize Feed/i });
    fireEvent.click(customizeBtn);

    expect(store.getState().ui.settingsDrawerOpen).toBe(true);
  });
});
