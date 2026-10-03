"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: "modal" | "drawer";
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "modal",
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = "hidden";

      // Focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
        if (triggerRef.current instanceof HTMLElement) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content panel */}
      {variant === "modal" ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby={description ? "dialog-description" : undefined}
          tabIndex={-1}
          className={cn(
            "relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-200 focus:outline-none",
            className
          )}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div>
              <h2 id="dialog-title" className="text-lg font-semibold text-text">
                {title}
              </h2>
              {description && (
                <p id="dialog-description" className="text-sm text-text-muted mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      ) : (
        /* Drawer variant (slide-in from right) */
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby={description ? "dialog-description" : undefined}
          tabIndex={-1}
          className={cn(
            "fixed inset-y-0 right-0 w-full max-w-md bg-surface border-l border-border shadow-2xl p-6 overflow-y-auto z-10 animate-in slide-in-from-right duration-300 focus:outline-none",
            className
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
            <div>
              <h2 id="dialog-title" className="text-xl font-bold text-text">
                {title}
              </h2>
              {description && (
                <p id="dialog-description" className="text-sm text-text-muted mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
