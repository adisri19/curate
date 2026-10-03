"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Tooltip content={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        className="p-2 rounded-xl border border-border bg-surface text-text hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>
    </Tooltip>
  );
}
