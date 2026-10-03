import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error && id ? `${id}-error` : undefined}
            className={cn(
              "w-full h-10 px-3.5 rounded-lg border bg-surface text-text placeholder:text-text-muted/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error ? "border-danger focus:ring-danger" : "border-border hover:border-text-muted/40",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={id ? `${id}-error` : undefined} className="mt-1 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
