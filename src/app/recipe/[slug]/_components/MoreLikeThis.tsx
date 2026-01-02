"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat, Soup, Scale, Timer, ArrowRightLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RelatedRecipe {
  id: number;
  name: string;
  slug: string;
  prepTime: number | null;
  cookTime: number | null;
  difficulty: string | null;
  heroImage: { url: string; name: string } | null;
}

interface MoreLikeThisProps {
  recipes: RelatedRecipe[];
}

/**
 * Formats total cooking time for display.
 * @param prepTime - Prep time in minutes
 * @param cookTime - Cook time in minutes
 * @returns Formatted time string or null
 */
function formatTime(
  prepTime: number | null,
  cookTime: number | null
): string | null {
  const total = (prepTime ?? 0) + (cookTime ?? 0);
  if (total === 0) return null;
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

/**
 * Compact recipe card for related recipes section.
 * Shows title, time, difficulty, and smart feature icons.
 * @param recipe - The recipe to display
 */
function CompactRecipeCard({
  recipe,
}: {
  recipe: RelatedRecipe;
}): JSX.Element {
  const timeDisplay = formatTime(recipe.prepTime, recipe.cookTime);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {recipe.heroImage?.url ? (
          <Image
            src={recipe.heroImage.url}
            alt={recipe.heroImage.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Soup className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="mb-2 line-clamp-1 text-sm font-medium leading-tight">
          {recipe.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {timeDisplay && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeDisplay}
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-1">
                <ChefHat className="h-3 w-3" />
                {recipe.difficulty}
              </span>
            )}
          </div>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Scale className="h-3.5 w-3.5 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>Scalable</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Timer className="h-3.5 w-3.5 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>Adjust time</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>Swaps available</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </Link>
  );
}

/**
 * Related recipes section with compact cards.
 * Shows up to 6 similar recipes for discovery.
 * @param recipes - Array of related recipes
 */
export function MoreLikeThis({ recipes }: MoreLikeThisProps): JSX.Element | null {
  if (recipes.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold">More like this</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.slice(0, 6).map((recipe) => (
          <CompactRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

