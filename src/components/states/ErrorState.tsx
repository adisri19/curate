import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Failed to load content",
  message = "An error occurred while communicating with the data service. Please check your network and try again.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 sm:p-10 text-center border border-danger/20 rounded-2xl bg-danger/5 max-w-md mx-auto my-8"
    >
      <div className="p-3 rounded-full bg-danger/10 text-danger mb-4">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          isLoading={isRetrying}
          className="border-danger/30 hover:bg-danger/10 text-danger gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
