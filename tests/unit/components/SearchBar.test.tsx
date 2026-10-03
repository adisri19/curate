import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/layout/SearchBar";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/feed",
}));

describe("SearchBar Component", () => {
  it("renders search input with placeholder and accessibility label", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Search news, movies, posts/i);
    expect(input).toBeInTheDocument();
  });

  it("shows clear button when input has text and clears on click", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Search news, movies, posts/i);

    fireEvent.change(input, { target: { value: "artificial intelligence" } });
    expect(input).toHaveValue("artificial intelligence");

    const clearBtn = screen.getByRole("button", { name: /Clear search/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(input).toHaveValue("");
  });
});
