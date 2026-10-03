"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { resetPreferences } from "@/store/slices/preferencesSlice";
import { showToast } from "@/store/slices/uiSlice";
import { CategoryChips } from "./CategoryChips";
import { HashtagInput } from "./HashtagInput";
import { useTheme } from "@/hooks/useTheme";
import { ThemeMode } from "@/types/preferences";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Sun, Moon, Laptop, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreferencesPanel({ onClose }: { onClose?: () => void }) {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleResetConfirm = () => {
    dispatch(resetPreferences());
    setShowConfirmReset(false);
    dispatch(
      showToast({
        message: "Preferences restored to default settings.",
        type: "info",
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <CategoryChips />

      {/* Hashtag Management */}
      <div className="pt-4 border-t border-border">
        <HashtagInput />
      </div>

      {/* Theme Appearance Selector */}
      <div className="pt-4 border-t border-border space-y-3">
        <label className="text-sm font-semibold text-text">Appearance Theme</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "light", label: "Light", icon: Sun },
            { id: "dark", label: "Dark", icon: Moon },
            { id: "system", label: "System", icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id as ThemeMode)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border bg-surface-elevated text-text-muted hover:text-text hover:bg-surface-hover"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirmReset(true)}
          className="text-xs text-danger hover:bg-danger/10 hover:border-danger/30 gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </Button>

        {onClose && (
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        )}
      </div>

      {/* Confirmation Dialog for Reset */}
      <Dialog
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="Reset all preferences?"
        description="This will restore all content categories, followed hashtags, and appearance settings back to their default values."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmReset(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleResetConfirm}
          >
            Yes, Reset Preferences
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
