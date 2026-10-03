"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissDemoBanner } from "@/store/slices/uiSlice";
import { Sparkles, X } from "lucide-react";

export function DemoBadge({ isDemoActive = true }: { isDemoActive?: boolean }) {
  const dispatch = useAppDispatch();
  const isDismissed = useAppSelector((state) => state.ui.demoBannerDismissed);

  if (!isDemoActive || isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Demo mode announcement"
      className="bg-primary/10 border-b border-primary/20 text-text px-4 py-2 text-xs flex items-center justify-between gap-4 transition-all"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong className="font-semibold text-primary">Demo Mode Active:</strong> Serving realistic curated fixtures because live API keys are optional. Add keys in <code className="bg-surface px-1 py-0.5 rounded border border-border">.env.local</code> to enable live upstream fetching.
        </span>
      </div>
      <button
        onClick={() => dispatch(dismissDemoBanner())}
        className="p-1 rounded hover:bg-primary/20 text-text-muted hover:text-text transition-colors shrink-0"
        aria-label="Dismiss demo mode banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
