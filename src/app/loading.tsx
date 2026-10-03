import React from "react";
import { LoadingSpinner } from "@/components/states/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <LoadingSpinner size="lg" label="Loading dashboard content..." />
    </div>
  );
}
