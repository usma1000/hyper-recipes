"use client";

import { cn } from "~/lib/utils";
import { Clock, Utensils, Dumbbell, Leaf, Zap, CalendarDays, Heart, Sparkles } from "lucide-react";

type QuickFilter = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const QUICK_FILTERS: QuickFilter[] = [
  { id: "20min", label: "20 min", icon: <Clock className="h-3.5 w-3.5" /> },
  { id: "one-pot", label: "One-pot", icon: <Utensils className="h-3.5 w-3.5" /> },
  { id: "high-protein", label: "High protein", icon: <Dumbbell className="h-3.5 w-3.5" /> },
  { id: "vegetarian", label: "Vegetarian", icon: <Leaf className="h-3.5 w-3.5" /> },
  { id: "low-effort", label: "Low effort", icon: <Zap className="h-3.5 w-3.5" /> },
  { id: "meal-prep", label: "Meal prep", icon: <CalendarDays className="h-3.5 w-3.5" /> },
  { id: "comfort", label: "Comfort", icon: <Heart className="h-3.5 w-3.5" /> },
  { id: "new", label: "New", icon: <Sparkles className="h-3.5 w-3.5" /> },
];

type QuickFiltersProps = {
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
};

/**
 * Compact chip bar for quick recipe filtering.
 * Toggles filters that affect the Explore grid client-side.
 * @param activeFilters - Array of active filter IDs
 * @param onFilterToggle - Callback when a filter is toggled
 */
export function QuickFilters({
  activeFilters,
  onFilterToggle,
}: QuickFiltersProps): JSX.Element {
  return (
    <div className="space-y-3">
      <p className="text-[14px] font-medium text-neutral-600 dark:text-neutral-400">
        Find something that fits...
      </p>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {QUICK_FILTERS.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
              )}
            >
              {filter.icon}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Filters recipes based on active quick filters.
 * @param recipes - Array of recipes to filter
 * @param activeFilters - Array of active filter IDs
 * @returns Filtered array of recipes
 */
export function filterRecipesByQuickFilters(
  recipes: Recipe[],
  activeFilters: string[]
): Recipe[] {
  if (activeFilters.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    return activeFilters.every((filterId) => {
      switch (filterId) {
        case "20min": {
          const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
          return totalTime > 0 && totalTime <= 20;
        }
        case "new": {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return new Date(recipe.createdAt) >= sevenDaysAgo;
        }
        case "vegetarian":
          return recipe.difficulty?.toLowerCase() === "easy" || true;
        case "low-effort":
          return recipe.difficulty?.toLowerCase() === "easy";
        default:
          return true;
      }
    });
  });
}

/**
 * Skeleton loader for quick filters.
 */
export function QuickFiltersSkeleton(): JSX.Element {
  return (
    <div className="space-y-3">
      <div className="h-5 w-40 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800"
          />
        ))}
      </div>
    </div>
  );
}

