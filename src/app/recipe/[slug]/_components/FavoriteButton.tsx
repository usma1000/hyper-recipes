"use client";

import { useEffect, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { checkIfFavorite, toggleFavorite } from "~/app/_actions/favorites";

interface FavoriteButtonProps {
  recipeId: number;
}

/**
 * Client-side favorite button that handles its own data fetching.
 * This prevents auth checks from blocking the main recipe content render.
 */
export function FavoriteButton({ recipeId }: FavoriteButtonProps): JSX.Element | null {
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
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending || isLoading}
    >
      <Star
        className={`h-5 w-5 transition-all active:-translate-y-1 ${
          isFavorite ? "fill-amber-400" : ""
        } ${isLoading ? "opacity-50" : ""}`}
      />
    </Button>
  );
}

