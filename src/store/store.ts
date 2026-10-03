import { combineReducers, configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./slices/preferencesSlice";
import favoritesReducer from "./slices/favoritesSlice";
import feedOrderReducer from "./slices/feedOrderSlice";
import searchReducer from "./slices/searchSlice";
import historyReducer from "./slices/historySlice";
import uiReducer from "./slices/uiSlice";
import { contentApi } from "@/services/api";
import { savePersistedState } from "./persist";

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  favorites: favoritesReducer,
  feedOrder: feedOrderReducer,
  search: searchReducer,
  history: historyReducer,
  ui: uiReducer,
  [contentApi.reducerPath]: contentApi.reducer,
});

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(contentApi.middleware),
  });

  // Immediate auto-save listener for persisted slices
  if (typeof window !== "undefined") {
    store.subscribe(() => {
      const state = store.getState();
      savePersistedState({
        preferences: state.preferences,
        favorites: state.favorites,
        feedOrder: state.feedOrder,
        history: state.history,
      });
    });
  }

  return store;
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
