"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard caught uncaught error:", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto"
    >
      <div className="p-4 rounded-2xl bg-danger/10 text-danger mb-4 shadow-sm">
        <AlertCircle className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h1 className="text-2xl font-bold text-text mb-2">Something went wrong</h1>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">
        An unhandled application error occurred. We have safely contained it to prevent data loss.
      </p>
      <Button
        onClick={() => reset()}
        variant="primary"
        size="md"
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Reload Dashboard
      </Button>
    </div>
  );
}
