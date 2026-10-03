import { describe, it, expect } from "vitest";
import preferencesReducer, {
  toggleCategory,
  setCategories,
  addHashtag,
  removeHashtag,
  setTheme,
  resetPreferences,
} from "@/store/slices/preferencesSlice";
import { DEFAULT_PREFERENCES } from "@/lib/categories";

describe("preferencesSlice", () => {
  it("should initialize with default preferences", () => {
    const state = preferencesReducer(undefined, { type: "@@INIT" });
    expect(state.categories).toEqual(DEFAULT_PREFERENCES.categories);
    expect(state.hashtags).toEqual(DEFAULT_PREFERENCES.hashtags);
    expect(state.theme).toEqual("system");
    expect(state.language).toEqual("en");
  });

  it("should add an unselected valid category", () => {
    const initialState = {
      categories: ["technology"],
      hashtags: [],
      theme: "system" as const,
      language: "en",
    };
    const nextState = preferencesReducer(initialState, toggleCategory("sports"));
    expect(nextState.categories).toContain("sports");
  });

  it("should remove a category if more than one category is selected", () => {
    const initialState = {
      categories: ["technology", "sports"],
      hashtags: [],
      theme: "system" as const,
      language: "en",
    };
    const nextState = preferencesReducer(initialState, toggleCategory("sports"));
    expect(nextState.categories).toEqual(["technology"]);
  });

  it("should NOT remove the last remaining category (minimum 1 required)", () => {
    const initialState = {
      categories: ["technology"],
      hashtags: [],
      theme: "system" as const,
      language: "en",
    };
    const nextState = preferencesReducer(initialState, toggleCategory("technology"));
    expect(nextState.categories).toEqual(["technology"]);
  });

  it("should normalize and add hashtags cleanly", () => {
    const initialState = {
      categories: ["technology"],
      hashtags: ["ai"],
      theme: "system" as const,
      language: "en",
    };
    // Strips '#' and lowercases
    const nextState = preferencesReducer(initialState, addHashtag("#MachineLearning"));
    expect(nextState.hashtags).toContain("machinelearning");
  });

  it("should not add duplicate hashtags or exceed limit of 10", () => {
    let state: any = {
      categories: ["technology"],
      hashtags: ["tag1", "tag2"],
      theme: "system",
      language: "en",
    };
    state = preferencesReducer(state, addHashtag("tag1"));
    expect(state.hashtags.length).toBe(2);

    for (let i = 3; i <= 15; i++) {
      state = preferencesReducer(state, addHashtag(`tag${i}`));
    }
    expect(state.hashtags.length).toBe(10);
  });

  it("should remove hashtags", () => {
    const initialState = {
      categories: ["technology"],
      hashtags: ["ai", "crypto"],
      theme: "system" as const,
      language: "en",
    };
    const nextState = preferencesReducer(initialState, removeHashtag("ai"));
    expect(nextState.hashtags).toEqual(["crypto"]);
  });

  it("should set theme and reset preferences to defaults", () => {
    let state: any = preferencesReducer(undefined, setTheme("dark"));
    expect(state.theme).toBe("dark");

    state = preferencesReducer(state, resetPreferences());
    expect(state.theme).toBe("system");
    expect(state.categories).toEqual(DEFAULT_PREFERENCES.categories);
  });

  it("should set categories when valid non-empty array is provided", () => {
    const updated = preferencesReducer(undefined, setCategories(["science", "health"]));
    expect(updated.categories).toEqual(["science", "health"]);
  });
});
