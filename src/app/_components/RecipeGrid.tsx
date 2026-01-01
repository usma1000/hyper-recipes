import { Suspense } from "react";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./RecipeCardSkeleton";

type RecipeGridProps = {
  recipes: Recipe[];
  columns?: 2 | 3 | 4;
};

/**
 * Displays recipes in a scannable grid layout.
 * Replaces the carousel for better browsability and visual scanning.
 * @param recipes - Array of recipes to display
 * @param columns - Number of columns on desktop (default: 3)
 */
export function RecipeGrid({ recipes, columns = 3 }: RecipeGridProps): JSX.Element {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <p className="text-[15px] text-neutral-400 dark:text-neutral-500">No recipes found</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {recipes.map((recipe) => (
        <Suspense key={recipe.id} fallback={<RecipeCardSkeleton />}>
          <RecipeCard recipe={recipe} />
        </Suspense>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for the recipe grid.
 * @param count - Number of skeleton cards to show
 * @param columns - Number of columns on desktop
 */
export function RecipeGridSkeleton({ 
  count = 9, 
  columns = 3 
}: { 
  count?: number; 
  columns?: 2 | 3 | 4;
}): JSX.Element {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {[...Array(count)].map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
