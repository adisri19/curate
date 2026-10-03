import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-dashed border-border rounded-2xl bg-surface/50 max-w-md mx-auto my-8">
      <div className="p-3 rounded-full bg-surface-elevated text-text-muted mb-4">
        {icon || <FolderOpen className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
