import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { PreferencesPanel } from "@/components/settings/PreferencesPanel";
import { setCategories } from "@/store/slices/preferencesSlice";

describe("PreferencesPanel Component", () => {
  it("renders category chips and appearance options", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <PreferencesPanel />
      </Provider>
    );

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("prevents deselecting the last remaining category", () => {
    const store = makeStore();
    // Force only 1 category to be selected
    store.dispatch(setCategories(["technology"]));

    render(
      <Provider store={store}>
        <PreferencesPanel />
      </Provider>
    );

    const techChip = screen.getByRole("button", { name: /^Technology$/i });
    expect(techChip).toHaveAttribute("aria-pressed", "true");

    // Click to attempt deselecting the only remaining category
    fireEvent.click(techChip);

    // State should remain with 'technology' selected
    const state = store.getState();
    expect(state.preferences.categories).toEqual(["technology"]);

    // Toast should show warning message
    expect(state.ui.activeToast?.message).toContain("At least one category must remain selected");
  });
});
