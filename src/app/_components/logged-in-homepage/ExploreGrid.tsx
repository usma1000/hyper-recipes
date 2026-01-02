"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { QuickFilters, filterRecipesByQuickFilters, QuickFiltersSkeleton } from "./QuickFilters";
import { SmartRecipeCard, SmartRecipeCardSkeleton } from "./SmartRecipeCard";

type ExploreGridProps = {
  recipes: Recipe[];
  tags: Array<{
    id: number;
    name: string;
    tagType: "Cuisine" | "Meal" | "Diet";
  }>;
  recipesByTag: Record<number, Recipe[]>;
};

const INITIAL_DISPLAY_COUNT = 6;
const LOAD_MORE_COUNT = 6;

/**
 * Recipe discovery grid with quick filters.
 * Shows filtered recipes with "Show more" pagination.
 * @param recipes - All available recipes
 * @param tags - Available tags for enriching recipe cards
 * @param recipesByTag - Recipes grouped by tag ID (for tag lookup)
 */
export function ExploreGrid({
  recipes,
  tags,
  recipesByTag,
}: ExploreGridProps): JSX.Element {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const handleFilterToggle = (filterId: string): void => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  const filteredRecipes = useMemo(() => {
    return filterRecipesByQuickFilters(recipes, activeFilters);
  }, [recipes, activeFilters]);

  const displayedRecipes = filteredRecipes.slice(0, displayCount);
  const hasMore = displayCount < filteredRecipes.length;

  const handleShowMore = (): void => {
    setDisplayCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const getTagsForRecipe = (recipeId: number): Array<{ id: number; name: string; tagType: string }> => {
    const matchingTags: Array<{ id: number; name: string; tagType: string }> = [];
    for (const tag of tags) {
      const tagRecipes = recipesByTag[tag.id];
      if (tagRecipes?.some((r) => r.id === recipeId)) {
        matchingTags.push(tag);
      }
    }
    return matchingTags;
  };

  return (
    <section className="py-2">
      <div className="mb-6">
        <h2 className="mb-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Explore smart recipes
        </h2>
        <p className="mb-5 text-[15px] text-neutral-500 dark:text-neutral-400">
          Discover recipes that adapt to your needs
        </p>
        <QuickFilters
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
        />
      </div>

      {displayedRecipes.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-12 dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400">
            No recipes match your filters. Try removing some filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {displayedRecipes.map((recipe) => (
              <SmartRecipeCard
                key={recipe.id}
                recipe={recipe}
                tags={getTagsForRecipe(recipe.id)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleShowMore}
                className="px-8"
              >
                Show more recipes
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/**
 * Skeleton loader for explore grid.
 */
export function ExploreGridSkeleton(): JSX.Element {
  return (
    <section className="py-2">
      <div className="mb-6">
        <div className="mb-1 h-7 w-48 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="mb-5 h-5 w-64 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
        <QuickFiltersSkeleton />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SmartRecipeCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

