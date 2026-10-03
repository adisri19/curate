import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedFilterType } from "@/types/content";

export interface SearchState {
  query: string;
  typeFilter: FeedFilterType;
}

const initialState: SearchState = {
  query: "",
  typeFilter: "all",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<FeedFilterType>) => {
      state.typeFilter = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.typeFilter = "all";
    },
  },
});

export const { setQuery, setTypeFilter, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
