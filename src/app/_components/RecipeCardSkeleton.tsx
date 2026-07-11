import React from "react";

/**
 * Skeleton loader for recipe cards with refined styling.
 */
export default function RecipeCardSkeleton(): JSX.Element {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="p-5">
        <div className="mb-3 h-5 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
