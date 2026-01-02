"use client";

import Link from "next/link";
import Image from "next/image";
import { Soup, Clock, ChefHat, ArrowLeftRight, Scale, Timer, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "~/lib/utils";

type SmartRecipeCardProps = {
  recipe: Recipe;
  onSave?: (recipeId: number) => void;
  isSaved?: boolean;
  tags?: Array<{ id: number; name: string; tagType: string }>;
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
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Enhanced recipe card with time, difficulty, tags, and smart capability badges.
 * Shows metadata to help users make quick decisions.
 * @param recipe - The recipe to display
 * @param onSave - Optional callback when save button is clicked
 * @param isSaved - Whether the recipe is already saved
 * @param tags - Optional tags to display
 */
export function SmartRecipeCard({
  recipe,
  onSave,
  isSaved = false,
  tags = [],
}: SmartRecipeCardProps): JSX.Element {
  const timeDisplay = formatTime(recipe.prepTime, recipe.cookTime);
  const displayTags = tags.slice(0, 2);

  const handleSaveClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(recipe.id);
  };

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-neutral-950/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {recipe.heroImage?.url ? (
          <Image
            src={recipe.heroImage.url}
            alt={recipe.heroImage.name}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Soup size={48} className="text-neutral-300 dark:text-neutral-600" />
          </div>
        )}

        {onSave && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white dark:bg-neutral-900/90 dark:hover:bg-neutral-900",
              isSaved && "text-red-500"
            )}
            onClick={handleSaveClick}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-[16px] font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200">
          {recipe.name}
        </h3>

        {/* Time and difficulty row */}
        <div className="mb-3 flex items-center gap-3 text-[13px] text-neutral-500 dark:text-neutral-400">
          {timeDisplay && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeDisplay}
            </span>
          )}
          {recipe.difficulty && (
            <span className="flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5" />
              {recipe.difficulty}
            </span>
          )}
        </div>

        {/* Tags row */}
        {displayTags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {displayTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-2 py-0.5 text-[11px] font-medium"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Smart capabilities row */}
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <ArrowLeftRight className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ingredient swaps available</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Scale className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Scale servings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Timer className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust cook time</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </Link>
  );
}

/**
 * Skeleton loader for smart recipe card.
 */
export function SmartRecipeCardSkeleton(): JSX.Element {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-[4/3] animate-pulse bg-neutral-100 dark:bg-neutral-800" />
      <div className="p-4">
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="mb-3 flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 w-12 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="mb-3 flex gap-1.5">
          <div className="h-5 w-14 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-6 w-6 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-6 w-6 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

