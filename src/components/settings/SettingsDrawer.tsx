"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSettingsDrawerOpen } from "@/store/slices/uiSlice";
import { Dialog } from "@/components/ui/Dialog";
import { PreferencesPanel } from "./PreferencesPanel";

export function SettingsDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.settingsDrawerOpen);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => dispatch(setSettingsDrawerOpen(false))}
      title="Feed Preferences"
      description="Personalize your dashboard content, followed hashtags, and appearance theme."
      variant="drawer"
    >
      <PreferencesPanel onClose={() => dispatch(setSettingsDrawerOpen(false))} />
    </Dialog>
  );
}
