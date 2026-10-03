"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCategory } from "@/store/slices/preferencesSlice";
import { showToast } from "@/store/slices/uiSlice";
import { CATEGORIES } from "@/lib/categories";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoryChips() {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector((state) => state.preferences.categories);

  const handleToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId) && selectedCategories.length <= 1) {
      dispatch(
        showToast({
          message: "At least one category must remain selected.",
          type: "error",
        })
      );
      return;
    }
    dispatch(toggleCategory(categoryId));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-text">Content Categories</label>
        <span className="text-xs text-text-muted">
          {selectedCategories.length} selected (min 1)
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleToggle(cat.id)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-surface-elevated text-text hover:bg-surface-hover border-border"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
