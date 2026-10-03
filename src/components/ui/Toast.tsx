"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideToast } from "@/store/slices/uiSlice";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toast() {
  const dispatch = useAppDispatch();
  const activeToast = useAppSelector((state) => state.ui.activeToast);

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeToast, dispatch]);

  if (!activeToast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
    info: <Info className="w-5 h-5 text-primary shrink-0" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border shadow-xl text-text max-w-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {iconMap[activeToast.type]}
      <p className="text-sm font-medium pr-2">{activeToast.message}</p>
      <button
        onClick={() => dispatch(hideToast())}
        className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
