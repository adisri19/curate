import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

describe("ThemeToggle Component", () => {
  it("toggles between dark and light themes on click", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Initial state is system/light -> clicking switches to dark
    fireEvent.click(button);
    expect(store.getState().preferences.theme).toBe("dark");

    // Clicking again switches to light
    fireEvent.click(button);
    expect(store.getState().preferences.theme).toBe("light");
  });
});
