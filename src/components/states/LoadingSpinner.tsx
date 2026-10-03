import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      role="status"
      className={cn("flex flex-col items-center justify-center gap-3 p-6", className)}
    >
      <div
        className={cn(
          "rounded-full border-border border-t-primary animate-spin",
          sizeStyles[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
