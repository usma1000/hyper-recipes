"use client";

import { useEffect } from "react";
import { useRecentRecipes } from "./useRecentRecipes";

type RecipeViewTrackerProps = {
  recipeId: number;
};

/**
 * Client component that tracks recipe views in localStorage.
 * Mount this in recipe pages to enable the Continue row on the homepage.
 * @param recipeId - The ID of the recipe being viewed
 */
export function RecipeViewTracker({ recipeId }: RecipeViewTrackerProps): null {
  const { addRecentRecipe } = useRecentRecipes();

  useEffect(() => {
    addRecentRecipe(recipeId);
  }, [recipeId, addRecentRecipe]);

  return null;
}

