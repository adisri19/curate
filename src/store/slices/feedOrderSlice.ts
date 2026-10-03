import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/types/content";

export interface FeedOrderState {
  customOrderIds: string[];
}

const initialState: FeedOrderState = {
  customOrderIds: [],
};

export const feedOrderSlice = createSlice({
  name: "feedOrder",
  initialState,
  reducers: {
    reorder: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number; currentIds?: string[] }>
    ) => {
      const { fromIndex, toIndex, currentIds } = action.payload;
      if (state.customOrderIds.length === 0 && currentIds) {
        state.customOrderIds = [...currentIds];
      }
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.customOrderIds.length ||
        toIndex >= state.customOrderIds.length
      ) {
        return;
      }
      const item = state.customOrderIds.splice(fromIndex, 1)[0];
      state.customOrderIds.splice(toIndex, 0, item);
    },
    setCustomOrder: (state, action: PayloadAction<string[]>) => {
      state.customOrderIds = action.payload;
    },
    resetOrder: (state) => {
      state.customOrderIds = [];
    },
    moveItemByStep: (
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down"; currentIds?: string[] }>
    ) => {
      const { id, direction, currentIds } = action.payload;
      if (state.customOrderIds.length === 0 && currentIds) {
        state.customOrderIds = [...currentIds];
      }
      const index = state.customOrderIds.indexOf(id);
      if (index === -1) return;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < state.customOrderIds.length) {
        const item = state.customOrderIds.splice(index, 1)[0];
        state.customOrderIds.splice(targetIndex, 0, item);
      }
    },
  },
});

export const { reorder, setCustomOrder, resetOrder, moveItemByStep } = feedOrderSlice.actions;

/**
 * Merges the user's custom order with incoming fetched items.
 * Preserves the custom order for existing items, drops IDs no longer present,
 * and appends new items in their natural order.
 */
export function applyFeedOrder(
  savedOrderIds: string[],
  incomingItems: ContentItem[]
): ContentItem[] {
  if (!savedOrderIds || savedOrderIds.length === 0) {
    return incomingItems;
  }

  const itemsMap = new Map<string, ContentItem>();
  for (const item of incomingItems) {
    itemsMap.set(item.id, item);
  }

  const orderedItems: ContentItem[] = [];
  const processedIds = new Set<string>();

  // 1. Add items that exist in custom order
  for (const id of savedOrderIds) {
    const item = itemsMap.get(id);
    if (item) {
      orderedItems.push(item);
      processedIds.add(id);
    }
  }

  // 2. Append new items not yet in custom order
  for (const item of incomingItems) {
    if (!processedIds.has(item.id)) {
      orderedItems.push(item);
    }
  }

  return orderedItems;
}

export default feedOrderSlice.reducer;
