import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/types/content";

export interface FavoritesState {
  items: Record<string, ContentItem>;
}

const initialState: FavoritesState = {
  items: {},
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      if (state.items[item.id]) {
        delete state.items[item.id];
      } else {
        // Store full snapshot for offline/reload persistence
        state.items[item.id] = { ...item };
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    clearFavorites: (state) => {
      state.items = {};
    },
    setFavorites: (state, action: PayloadAction<Record<string, ContentItem>>) => {
      state.items = action.payload || {};
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites, setFavorites } =
  favoritesSlice.actions;

// Base state selector
const selectFavoritesState = (state: { favorites: FavoritesState }) => state.favorites;

// Memoized selectors
export const selectFavoritesMap = createSelector(
  [selectFavoritesState],
  (favorites) => favorites.items
);

export const selectFavoritesList = createSelector(
  [selectFavoritesMap],
  (items): ContentItem[] => Object.values(items).sort((a, b) => {
    // Sort recent first
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  })
);

export const selectFavoritesCount = createSelector(
  [selectFavoritesMap],
  (items) => Object.keys(items).length
);

export const selectIsFavorite = (id: string) =>
  createSelector([selectFavoritesMap], (items) => Boolean(items[id]));

export default favoritesSlice.reducer;
