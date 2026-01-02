"use client";

import { cn } from "~/lib/utils";

interface StepCardProps {
  stepNumber: number;
  content: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
}

/**
 * Individual step card with step number and content.
 * Designed for scannability with clear visual hierarchy.
 * @param stepNumber - The step number (1-indexed)
 * @param content - The step text content
 * @param isActive - Whether this step is currently active
 * @param isCompleted - Whether this step has been completed
 * @param onClick - Optional click handler
 */
export function StepCard({
  stepNumber,
  content,
  isActive = false,
  isCompleted = false,
  onClick,
}: StepCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "group relative rounded-lg border p-4 transition-all",
        isActive && "border-primary bg-primary/5 ring-1 ring-primary",
        isCompleted && "border-muted bg-muted/30",
        !isActive && !isCompleted && "border-border hover:border-primary/50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            isActive && "bg-primary text-primary-foreground",
            isCompleted && "bg-muted-foreground/20 text-muted-foreground",
            !isActive && !isCompleted && "bg-muted text-muted-foreground"
          )}
        >
          {isCompleted ? "✓" : stepNumber}
        </div>
        <div className="flex-1 pt-1">
          <p
            className={cn(
              "text-[15px] leading-relaxed",
              isCompleted && "text-muted-foreground line-through"
            )}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

