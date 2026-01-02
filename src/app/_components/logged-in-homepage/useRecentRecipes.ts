"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "hyper-recipes:recent";
const MAX_RECENT_RECIPES = 10;

type UseRecentRecipesReturn = {
  recentRecipeIds: number[];
  addRecentRecipe: (recipeId: number) => void;
  isLoading: boolean;
};

/**
 * Hook to manage recently viewed recipes via localStorage.
 * Stores up to 10 recipe IDs, most recent first.
 * @returns Object with recentRecipeIds array and addRecentRecipe function
 */
export function useRecentRecipes(): UseRecentRecipesReturn {
  const [recentRecipeIds, setRecentRecipeIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as number[];
        setRecentRecipeIds(parsed);
      }
    } catch (error) {
      console.error("Failed to load recent recipes from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRecentRecipe = useCallback((recipeId: number): void => {
    setRecentRecipeIds((prev) => {
      const filtered = prev.filter((id) => id !== recipeId);
      const updated = [recipeId, ...filtered].slice(0, MAX_RECENT_RECIPES);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save recent recipes to localStorage:", error);
      }

      return updated;
    });
  }, []);

  return {
    recentRecipeIds,
    addRecentRecipe,
    isLoading,
  };
}

