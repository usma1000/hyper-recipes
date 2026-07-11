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
      className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-foreground/15 hover:shadow-lg hover:shadow-lift dark:border-border dark:bg-card dark:hover:border-border dark:hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted dark:bg-muted">
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
            <Soup size={48} className="text-muted-foreground/40 dark:text-muted-foreground" />
          </div>
        )}

        {onSave && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 h-8 w-8 rounded-full bg-card/90 backdrop-blur-sm transition-all hover:bg-card dark:bg-card/90 dark:hover:bg-card",
              isSaved && "text-destructive"
            )}
            onClick={handleSaveClick}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 font-display text-[16px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
          {recipe.name}
        </h3>

        {/* Time and difficulty row */}
        <div className="mb-3 flex items-center gap-3 text-[13px] text-muted-foreground dark:text-muted-foreground">
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
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted dark:bg-muted">
                  <ArrowLeftRight className="h-3 w-3 text-muted-foreground dark:text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ingredient swaps available</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted dark:bg-muted">
                  <Scale className="h-3 w-3 text-muted-foreground dark:text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Scale servings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted dark:bg-muted">
                  <Timer className="h-3 w-3 text-muted-foreground dark:text-muted-foreground" />
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
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-card dark:border-border dark:bg-card">
      <div className="relative aspect-[4/3] animate-pulse bg-muted dark:bg-muted" />
      <div className="p-4">
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted dark:bg-muted" />
        <div className="mb-3 flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded bg-muted dark:bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted dark:bg-muted" />
        </div>
        <div className="mb-3 flex gap-1.5">
          <div className="h-5 w-14 animate-pulse rounded-full bg-muted dark:bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted dark:bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 animate-pulse rounded-md bg-muted dark:bg-muted" />
          <div className="h-6 w-6 animate-pulse rounded-md bg-muted dark:bg-muted" />
          <div className="h-6 w-6 animate-pulse rounded-md bg-muted dark:bg-muted" />
        </div>
      </div>
    </div>
  );
}

