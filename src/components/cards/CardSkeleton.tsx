import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-xs h-full"
    >
      {/* 16:9 Aspect Ratio Image Skeleton */}
      <div className="relative aspect-video w-full bg-surface-elevated">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Meta Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title */}
        <div className="space-y-1.5 mt-1">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Description */}
        <div className="space-y-1.5 my-2 flex-1">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-auto">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
