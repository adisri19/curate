import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { HashtagInput } from "@/components/settings/HashtagInput";

describe("HashtagInput Component", () => {
  it("renders input, add button, and existing hashtags", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <HashtagInput />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/e.g. ai, webdev/i);
    expect(input).toBeInTheDocument();
    expect(screen.getByText("#technology")).toBeInTheDocument();
  });

  it("adds a new hashtag cleanly with Enter or button click", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <HashtagInput />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/e.g. ai, webdev/i);
    fireEvent.change(input, { target: { value: "robotics" } });

    const addBtn = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(addBtn);

    expect(screen.getByText("#robotics")).toBeInTheDocument();
    expect(store.getState().preferences.hashtags).toContain("robotics");
  });

  it("removes a hashtag when clicking its remove button", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <HashtagInput />
      </Provider>
    );

    const removeBtn = screen.getByRole("button", { name: /Remove #technology/i });
    fireEvent.click(removeBtn);

    expect(screen.queryByText("#technology")).not.toBeInTheDocument();
    expect(store.getState().preferences.hashtags).not.toContain("technology");
  });
});
