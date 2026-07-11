"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Soup, Clock, ChefHat, Shuffle, Heart, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecentRecipes } from "./useRecentRecipes";

type CookNowSpotlightProps = {
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
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Large spotlight card showing the primary recipe to cook.
 * Shows last viewed recipe if available, otherwise a random "good default".
 * @param recipes - Array of available recipes
 */
export function CookNowSpotlight({ recipes }: CookNowSpotlightProps): JSX.Element {
  const { recentRecipeIds, isLoading: isLoadingRecent } = useRecentRecipes();
  const [swapIndex, setSwapIndex] = useState(0);

  const spotlightRecipe = useMemo(() => {
    if (recipes.length === 0) return null;

    if (recentRecipeIds.length > 0 && swapIndex === 0) {
      const lastViewed = recipes.find((r) => r.id === recentRecipeIds[0]);
      if (lastViewed) return lastViewed;
    }

    const adjustedIndex = swapIndex % recipes.length;
    return recipes[adjustedIndex] ?? recipes[0];
  }, [recipes, recentRecipeIds, swapIndex]);

  const handleSwap = (): void => {
    setSwapIndex((prev) => prev + 1);
  };

  if (isLoadingRecent || !spotlightRecipe) {
    return <CookNowSpotlightSkeleton />;
  }

  const timeDisplay = formatTime(spotlightRecipe.prepTime, spotlightRecipe.cookTime);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted dark:border-border dark:from-card dark:to-muted/80">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      <div className="relative p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground dark:text-foreground">
            Cook now
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
            onClick={handleSwap}
          >
            <Shuffle className="h-4 w-4" />
            Swap for another
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Recipe Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted dark:bg-muted md:aspect-square">
            {spotlightRecipe.heroImage?.url ? (
              <Image
                src={spotlightRecipe.heroImage.url}
                alt={spotlightRecipe.heroImage.name}
                fill={true}
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Soup size={64} className="text-muted-foreground/40 dark:text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Recipe Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight text-foreground dark:text-foreground md:text-3xl">
                {spotlightRecipe.name}
              </h3>
              
              <p className="mb-4 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground dark:text-muted-foreground">
                {spotlightRecipe.description}
              </p>

              {/* Metadata badges */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {timeDisplay && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {timeDisplay}
                  </Badge>
                )}
                {spotlightRecipe.difficulty && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <ChefHat className="h-3.5 w-3.5" />
                    {spotlightRecipe.difficulty}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/recipe/${spotlightRecipe.slug}`}>
                <Button size="lg" className="gap-2">
                  Start cooking
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <FolderPlus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton loader for cook now spotlight.
 */
export function CookNowSpotlightSkeleton(): JSX.Element {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card p-6 dark:border-border dark:bg-card md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-muted dark:bg-muted" />
        <div className="h-9 w-36 animate-pulse rounded bg-muted dark:bg-muted" />
      </div>
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted dark:bg-muted md:aspect-square" />
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-2 h-9 w-3/4 animate-pulse rounded bg-muted dark:bg-muted" />
            <div className="mb-4 h-12 w-full animate-pulse rounded bg-muted dark:bg-muted" />
            <div className="mb-6 flex gap-3">
              <div className="h-8 w-20 animate-pulse rounded-full bg-muted dark:bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded-full bg-muted dark:bg-muted" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-32 animate-pulse rounded-lg bg-muted dark:bg-muted" />
            <div className="h-11 w-11 animate-pulse rounded-lg bg-muted dark:bg-muted" />
            <div className="h-11 w-11 animate-pulse rounded-lg bg-muted dark:bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}

