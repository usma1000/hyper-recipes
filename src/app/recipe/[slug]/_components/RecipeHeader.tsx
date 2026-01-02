"use client";

import { Clock, ChefHat, Users, Share2, Printer, Bookmark } from "lucide-react";
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

interface RecipeHeaderProps {
  recipe: {
    id: number;
    name: string;
    description: string;
    prepTime: number | null;
    cookTime: number | null;
    difficulty: string | null;
    slug: string;
  };
  tags: Array<{ id: number; name: string; tagType: string | null }>;
  servings: number;
}

/**
 * Formats total cooking time for display.
 * @param prepTime - Prep time in minutes
 * @param cookTime - Cook time in minutes
 * @returns Formatted time string or null
 */
function formatTotalTime(
  prepTime: number | null,
  cookTime: number | null
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
 * Recipe header with title, meta row, tags, and action buttons.
 * Designed to be the first thing users see - shows key info immediately.
 * @param recipe - The recipe data
 * @param tags - Array of recipe tags
 * @param servings - Current servings count
 */
export function RecipeHeader({
  recipe,
  tags,
  servings,
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
    <header className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            {recipe.name}
          </h1>
          {recipe.description && (
            <p className="max-w-2xl text-base text-muted-foreground">
              {recipe.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FavoriteButton recipeId={recipe.id} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Share
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
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {totalTime && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {totalTime}
          </span>
        )}
        {recipe.prepTime && recipe.cookTime && (
          <span className="text-xs">
            (Prep: {recipe.prepTime}m, Cook: {recipe.cookTime}m)
          </span>
        )}
        {difficultyLabel && (
          <Badge variant="secondary" className="font-normal">
            <ChefHat className="mr-1 h-3 w-3" />
            {difficultyLabel}
          </Badge>
        )}
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {servings} servings
        </span>
      </div>

      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="font-normal">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
}

