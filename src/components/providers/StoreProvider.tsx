"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store/store";
import { loadPersistedState } from "@/store/persist";
import { setCategories, setTheme } from "@/store/slices/preferencesSlice";
import { setFavorites } from "@/store/slices/favoritesSlice";
import { setCustomOrder } from "@/store/slices/feedOrderSlice";
import { setHistory } from "@/store/slices/historySlice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    // Hydrate persisted state on client mount to prevent SSR mismatch
    const persisted = loadPersistedState();
    if (persisted && store) {
      if (persisted.preferences) {
        if (persisted.preferences.categories) {
          store.dispatch(setCategories(persisted.preferences.categories));
        }
        if (persisted.preferences.theme) {
          store.dispatch(setTheme(persisted.preferences.theme));
        }
      }
      if (persisted.favorites) {
        store.dispatch(setFavorites(persisted.favorites));
      }
      if (persisted.feedOrder) {
        store.dispatch(setCustomOrder(persisted.feedOrder));
      }
      if (persisted.history) {
        store.dispatch(setHistory(persisted.history));
      }
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
