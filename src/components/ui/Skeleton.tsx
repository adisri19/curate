import React from "react";
import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-elevated/80 dark:bg-surface-elevated/40",
        className
      )}
      {...props}
    />
  );
}
