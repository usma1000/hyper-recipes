"use client";

import Image from "next/image";
import { Clock, ChefHat, Users, Share2, Printer, Soup, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCollectionButton } from "./AddToCollectionButton";
import type { RecipeCookStats } from "~/server/queries/cookingHistory";

interface RecipeHeaderProps {
  recipe: {
    id: number;
    name: string;
    description: string;
    prepTime: number | null;
    cookTime: number | null;
    difficulty: string | null;
    slug: string;
    heroImage: { url: string; name: string } | null;
  };
  tags: Array<{ id: number; name: string; tagType: string | null }>;
  servings: number;
  cookStats?: RecipeCookStats;
  onStartCookMode: () => void;
  onCheckIn: () => void;
}

/**
 * Formats total cooking time for display.
 * @param prepTime - Prep time in minutes
 * @param cookTime - Cook time in minutes
 * @returns Formatted time string or null
 */
function formatTotalTime(
  prepTime: number | null,
  cookTime: number | null,
): string | null {
  const total = (prepTime ?? 0) + (cookTime ?? 0);
  if (total === 0) return null;
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Maps difficulty value to display label.
 * @param difficulty - Raw difficulty string
 * @returns Display-friendly difficulty label
 */
function formatDifficulty(difficulty: string | null): string | null {
  if (!difficulty) return null;
  const lower = difficulty.toLowerCase();
  if (lower === "easy" || lower === "beginner") return "Beginner-friendly";
  if (lower === "medium" || lower === "intermediate") return "Intermediate";
  if (lower === "hard" || lower === "advanced") return "Advanced";
  return difficulty;
}

/**
 * Full-bleed hero header with photo, title, meta, and primary cook CTA.
 */
export function RecipeHeader({
  recipe,
  tags,
  servings,
  cookStats,
  onStartCookMode,
  onCheckIn,
}: RecipeHeaderProps): JSX.Element {
  const totalTime = formatTotalTime(recipe.prepTime, recipe.cookTime);
  const difficultyLabel = formatDifficulty(recipe.difficulty);
  const displayTags = tags.slice(0, 4);

  const handleShare = async (): Promise<void> => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <header className="relative">
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-muted sm:h-[52vh] sm:min-h-[360px]">
        {recipe.heroImage?.url ? (
          <Image
            src={recipe.heroImage.url}
            alt={recipe.heroImage.name || recipe.name}
            fill
            priority
            sizes="100vw"
            className="object-cover animate-fade-in"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-herb-muted via-muted to-secondary">
            <Soup className="h-20 w-20 text-herb/40" aria-hidden />
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container pb-8 pt-16 sm:pb-10">
            <div className="max-w-3xl animate-rise space-y-3">
              {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/80"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                {recipe.name}
              </h1>
              {recipe.description && (
                <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                  {recipe.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border/80 bg-card/80 backdrop-blur-sm">
        <div className="container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {totalTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" aria-hidden />
                <span className="font-medium text-foreground">{totalTime}</span>
                {recipe.prepTime != null && recipe.cookTime != null && (
                  <span className="text-xs">
                    · prep {recipe.prepTime}m · cook {recipe.cookTime}m
                  </span>
                )}
              </span>
            )}
            {difficultyLabel && (
              <Badge variant="secondary" className="font-normal">
                <ChefHat className="mr-1 h-3 w-3" aria-hidden />
                {difficultyLabel}
              </Badge>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" aria-hidden />
              {servings} servings
            </span>
            {cookStats?.avgRating != null && (
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
                {cookStats.avgRating.toFixed(1)}
              </span>
            )}
            {cookStats && cookStats.cookCount > 0 && (
              <span className="text-sm">
                {cookStats.cookCount === 1
                  ? "1 cook"
                  : `${cookStats.cookCount} cooks`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FavoriteButton recipeId={recipe.id} />
            <AddToCollectionButton recipeId={recipe.id} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy link</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Print</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="sm" onClick={onCheckIn}>
              I cooked this
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartCookMode}
              className="text-muted-foreground"
            >
              Cook Mode
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
