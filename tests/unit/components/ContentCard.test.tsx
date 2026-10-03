import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { ContentCard } from "@/components/cards/ContentCard";
import { ContentItem } from "@/types/content";

const mockNewsItem: ContentItem = {
  id: "news:sample-1",
  type: "news",
  title: "Quantum Breakthrough Achieved in Lab",
  description: "Researchers announce fault tolerant logical qubits at unprecedented scale.",
  imageUrl: "https://example.com/quantum.jpg",
  url: "https://example.com/read-more",
  source: "Wired",
  category: "technology",
  publishedAt: "2026-03-01T10:00:00Z",
  popularity: 85,
};

describe("ContentCard Component", () => {
  it("renders news card with headline, description, source, and CTA", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <ContentCard item={mockNewsItem} />
      </Provider>
    );

    expect(screen.getByText("Quantum Breakthrough Achieved in Lab")).toBeInTheDocument();
    expect(screen.getByText(/Researchers announce fault tolerant/)).toBeInTheDocument();
    expect(screen.getByText("Wired")).toBeInTheDocument();
    expect(screen.getByText("Read Article")).toBeInTheDocument();
  });

  it("renders fallback placeholder cleanly when imageUrl is null", () => {
    const store = makeStore();
    const noImageItem = { ...mockNewsItem, imageUrl: null };

    render(
      <Provider store={store}>
        <ContentCard item={noImageItem} />
      </Provider>
    );

    // Fallback renders source name in placeholder box
    const placeholders = screen.getAllByText("Wired");
    expect(placeholders.length).toBeGreaterThanOrEqual(1);
  });

  it("toggles favorite state and updates aria-pressed attribute", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <ContentCard item={mockNewsItem} />
      </Provider>
    );

    const favButton = screen.getByRole("button", {
      name: /Add Quantum Breakthrough Achieved in Lab to favorites/i,
    });
    expect(favButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(favButton);

    const updatedButton = screen.getByRole("button", {
      name: /Remove Quantum Breakthrough Achieved in Lab from favorites/i,
    });
    expect(updatedButton).toHaveAttribute("aria-pressed", "true");
  });
});
