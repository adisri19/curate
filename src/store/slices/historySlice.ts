import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryItem } from "@/types/preferences";

export interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    recordHistory: (
      state,
      action: PayloadAction<{ id: string; type: "news" | "movie" | "social"; category?: string; tmdbId?: number }>
    ) => {
      const { id, type, category, tmdbId } = action.payload;
      // Remove previous entry with same id if present to move it to the front
      const filtered = state.items.filter((item) => item.id !== id);
      const newEntry: HistoryItem = {
        id,
        type,
        category,
        tmdbId,
        timestamp: new Date().toISOString(),
      };
      // Keep last 20 items
      state.items = [newEntry, ...filtered].slice(0, 20);
    },
    clearHistory: (state) => {
      state.items = [];
    },
    setHistory: (state, action: PayloadAction<HistoryItem[]>) => {
      state.items = action.payload || [];
    },
  },
});

export const { recordHistory, clearHistory, setHistory } = historySlice.actions;

/**
 * Returns the most recent movie TMDB ID from history if available, for personalized recommendations.
 */
export const selectLatestMovieHistoryId = (state: { history: HistoryState }): number | undefined => {
  const movieItem = state.history.items.find(
    (item) => item.type === "movie" && item.tmdbId
  );
  return movieItem?.tmdbId;
};

export default historySlice.reducer;
