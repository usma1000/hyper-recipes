"use client";

import { useEffect, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { checkIfFavorite, toggleFavorite } from "~/app/_actions/favorites";
import { cn } from "~/lib/utils";

interface FavoriteButtonProps {
  recipeId: number;
}

/**
 * Client-side favorite button that handles its own data fetching.
 * This prevents auth checks from blocking the main recipe content render.
 */
export function FavoriteButton({
  recipeId,
}: FavoriteButtonProps): JSX.Element | null {
  const { isSignedIn, isLoaded } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    checkIfFavorite(recipeId)
      .then((result) => {
        setIsFavorite(result);
      })
      .catch((error) => {
        console.error("Failed to check favorite status:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [recipeId, isSignedIn, isLoaded]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleToggle = (): void => {
    startTransition(async () => {
      try {
        await toggleFavorite(recipeId, isFavorite);
        setIsFavorite(!isFavorite);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleToggle}
      disabled={isPending || isLoading}
      className={cn(
        "shadow-soft",
        isFavorite && "bg-accent text-accent-foreground hover:bg-accent/90",
      )}
    >
      <Star
        className={cn(
          "mr-1.5 h-4 w-4 transition-transform",
          isFavorite && "fill-current",
          isLoading && "opacity-50",
        )}
      />
      {isFavorite ? "Saved" : "Save"}
    </Button>
  );
}
