import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  mobileSidebarOpen: boolean;
  settingsDrawerOpen: boolean;
  demoBannerDismissed: boolean;
  activeToast: {
    id: string;
    message: string;
    type: "info" | "success" | "error";
  } | null;
}

const initialState: UiState = {
  mobileSidebarOpen: false,
  settingsDrawerOpen: false,
  demoBannerDismissed: false,
  activeToast: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebarOpen = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setSettingsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.settingsDrawerOpen = action.payload;
    },
    toggleSettingsDrawer: (state) => {
      state.settingsDrawerOpen = !state.settingsDrawerOpen;
    },
    dismissDemoBanner: (state) => {
      state.demoBannerDismissed = true;
    },
    setDemoBannerDismissed: (state, action: PayloadAction<boolean>) => {
      state.demoBannerDismissed = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type?: "info" | "success" | "error" }>
    ) => {
      state.activeToast = {
        id: Math.random().toString(36).substring(2, 9),
        message: action.payload.message,
        type: action.payload.type || "info",
      };
    },
    hideToast: (state) => {
      state.activeToast = null;
    },
  },
});

export const {
  setMobileSidebarOpen,
  toggleMobileSidebar,
  setSettingsDrawerOpen,
  toggleSettingsDrawer,
  dismissDemoBanner,
  setDemoBannerDismissed,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
