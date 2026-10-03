import { describe, it, expect } from "vitest";
import uiReducer, {
  setMobileSidebarOpen,
  toggleMobileSidebar,
  setSettingsDrawerOpen,
  toggleSettingsDrawer,
  dismissDemoBanner,
  showToast,
  hideToast,
} from "@/store/slices/uiSlice";

describe("uiSlice", () => {
  it("should toggle mobile sidebar and settings drawer", () => {
    let state = uiReducer(undefined, toggleMobileSidebar());
    expect(state.mobileSidebarOpen).toBe(true);

    state = uiReducer(state, setMobileSidebarOpen(false));
    expect(state.mobileSidebarOpen).toBe(false);

    state = uiReducer(state, toggleSettingsDrawer());
    expect(state.settingsDrawerOpen).toBe(true);

    state = uiReducer(state, setSettingsDrawerOpen(false));
    expect(state.settingsDrawerOpen).toBe(false);
  });

  it("should dismiss demo banner", () => {
    const state = uiReducer(undefined, dismissDemoBanner());
    expect(state.demoBannerDismissed).toBe(true);
  });

  it("should manage active toast notification", () => {
    let state = uiReducer(
      undefined,
      showToast({ message: "Test Success", type: "success" })
    );
    expect(state.activeToast).not.toBeNull();
    expect(state.activeToast?.message).toBe("Test Success");
    expect(state.activeToast?.type).toBe("success");

    state = uiReducer(state, hideToast());
    expect(state.activeToast).toBeNull();
  });
});
