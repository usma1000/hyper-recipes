"use server";

import {
  createFavoriteRecipe,
  removeFavoriteRecipe,
  isFavoriteRecipe,
  getMyFavoriteRecipes,
} from "~/server/queries";

export async function toggleFavorite(recipeId: number, isFavorite: boolean) {
  if (isFavorite) {
    await removeFavoriteRecipe(recipeId);
  } else {
    await createFavoriteRecipe(recipeId);
  }
}

export async function checkIfFavorite(recipeId: number) {
  return await isFavoriteRecipe(recipeId);
}

export async function fetchMyFavoriteRecipes() {
  return await getMyFavoriteRecipes();
}
