/**
 * Skeleton loader for recipe cards with refined styling.
 */
export default function RecipeCardSkeleton(): JSX.Element {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[4/3] animate-pulse bg-neutral-100 dark:bg-neutral-800" />
      <div className="p-5">
        <div className="mb-3 h-5 w-3/4 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
