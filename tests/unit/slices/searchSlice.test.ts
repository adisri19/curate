import { describe, it, expect } from "vitest";
import searchReducer, {
  setQuery,
  setTypeFilter,
  clearSearch,
} from "@/store/slices/searchSlice";

describe("searchSlice", () => {
  it("should update search query", () => {
    const state = searchReducer(undefined, setQuery("quantum computing"));
    expect(state.query).toBe("quantum computing");
  });

  it("should update type filter", () => {
    const state = searchReducer(undefined, setTypeFilter("movie"));
    expect(state.typeFilter).toBe("movie");
  });

  it("should clear search query and reset type filter", () => {
    let state = searchReducer(undefined, setQuery("artificial intelligence"));
    state = searchReducer(state, setTypeFilter("social"));

    state = searchReducer(state, clearSearch());
    expect(state.query).toBe("");
    expect(state.typeFilter).toBe("all");
  });
});
