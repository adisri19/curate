import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "news" | "movie" | "social" | "neutral" | "primary" | "outline";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    news: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    movie: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    social: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
    primary: "bg-primary/10 text-primary border border-primary/20",
    neutral: "bg-surface-elevated text-text-muted border border-border",
    outline: "border border-border text-text-muted bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
