import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreferences, ThemeMode } from "@/types/preferences";
import { DEFAULT_PREFERENCES, VALID_CATEGORY_IDS } from "@/lib/categories";
import { normalizeHashtag } from "@/lib/formatters";

const initialState: UserPreferences = {
  categories: DEFAULT_PREFERENCES.categories,
  hashtags: DEFAULT_PREFERENCES.hashtags,
  theme: DEFAULT_PREFERENCES.theme,
  language: DEFAULT_PREFERENCES.language,
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const cat = action.payload.toLowerCase();
      if (!VALID_CATEGORY_IDS.includes(cat)) return;

      if (state.categories.includes(cat)) {
        // Enforce at least one category selected
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== cat);
        }
      } else {
        state.categories.push(cat);
      }
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      const valid = action.payload
        .map((c) => c.toLowerCase())
        .filter((c) => VALID_CATEGORY_IDS.includes(c));
      if (valid.length > 0) {
        state.categories = Array.from(new Set(valid));
      }
    },
    addHashtag: (state, action: PayloadAction<string>) => {
      const normalized = normalizeHashtag(action.payload);
      if (!normalized) return;
      if (state.hashtags.includes(normalized)) return;
      if (state.hashtags.length >= 10) return; // max 10 tags
      state.hashtags.push(normalized);
    },
    removeHashtag: (state, action: PayloadAction<string>) => {
      const normalized = normalizeHashtag(action.payload);
      state.hashtags = state.hashtags.filter((h) => h !== normalized);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    resetPreferences: () => ({
      ...initialState,
    }),
  },
});

export const {
  toggleCategory,
  setCategories,
  addHashtag,
  removeHashtag,
  setTheme,
  setLanguage,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
