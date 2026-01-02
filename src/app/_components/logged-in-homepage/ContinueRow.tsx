"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Soup, Clock, ChefHat, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentRecipes } from "./useRecentRecipes";

type ContinueRowProps = {
  recipes: Recipe[];
};

/**
 * Formats total cooking time for display.
 * @param prepTime - Prep time in minutes
 * @param cookTime - Cook time in minutes
 * @returns Formatted time string or null
 */
function formatTime(prepTime: number | null, cookTime: number | null): string | null {
  const total = (prepTime ?? 0) + (cookTime ?? 0);
  if (total === 0) return null;
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Horizontal scroll row of recently viewed recipes.
 * Shows up to 6 cards based on localStorage tracking.
 * @param recipes - All available recipes (to match IDs against)
 */
export function ContinueRow({ recipes }: ContinueRowProps): JSX.Element {
  const { recentRecipeIds, isLoading } = useRecentRecipes();

  const recentRecipes = useMemo(() => {
    if (recentRecipeIds.length === 0) return [];
    
    return recentRecipeIds
      .map((id) => recipes.find((r) => r.id === id))
      .filter((r): r is Recipe => r !== undefined)
      .slice(0, 6);
  }, [recentRecipeIds, recipes]);

  if (isLoading) {
    return <ContinueRowSkeleton />;
  }

  if (recentRecipes.length === 0) {
    return (
      <section className="py-2">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Continue
        </h2>
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-8 dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400">
            Nothing yet. Save a recipe or start cooking to build your home feed.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
        Continue
      </h2>
      <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {recentRecipes.map((recipe) => (
          <ContinueCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

type ContinueCardProps = {
  recipe: Recipe;
};

/**
 * Compact card for the Continue row.
 * Smaller than SmartRecipeCard with "Resume" button.
 */
function ContinueCard({ recipe }: ContinueCardProps): JSX.Element {
  const timeDisplay = formatTime(recipe.prepTime, recipe.cookTime);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group flex w-[240px] shrink-0 gap-3 rounded-xl border border-neutral-200/60 bg-white p-3 transition-all duration-200 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
    >
      {/* Small image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {recipe.heroImage?.url ? (
          <Image
            src={recipe.heroImage.url}
            alt={recipe.heroImage.name}
            fill={true}
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Soup size={24} className="text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="truncate text-[14px] font-medium text-neutral-900 dark:text-white">
            {recipe.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-2 text-[12px] text-neutral-500 dark:text-neutral-400">
            {timeDisplay && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {timeDisplay}
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-0.5">
                <ChefHat className="h-3 w-3" />
                {recipe.difficulty}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-7 w-fit gap-1 px-2 text-[12px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <PlayCircle className="h-3.5 w-3.5" />
          Resume
        </Button>
      </div>
    </Link>
  );
}

/**
 * Skeleton loader for continue row.
 */
export function ContinueRowSkeleton(): JSX.Element {
  return (
    <section className="py-2">
      <div className="mb-4 h-6 w-24 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex w-[240px] shrink-0 gap-3 rounded-xl border border-neutral-200/60 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="h-4 w-full animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

