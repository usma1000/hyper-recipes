"use server";

import {
  getAllIngredients,
  getIngredientsForRecipe,
  createIngredientForRecipe,
  removeIngredientFromRecipe,
  createNewIngredient,
} from "~/server/queries";

export async function fetchAllIngredients() {
  return await getAllIngredients();
}

export async function fetchIngredientsForRecipe(recipeId: number) {
  return await getIngredientsForRecipe(recipeId);
}

export async function addIngredientToRecipe(
  recipeId: number,
  ingredientId: number,
  quantity: string,
) {
  await createIngredientForRecipe(recipeId, ingredientId, quantity);
}

export async function removeIngredient(recipeId: number, ingredientId: number) {
  await removeIngredientFromRecipe(recipeId, ingredientId);
}

export async function createIngredient(
  ingredient: Parameters<typeof createNewIngredient>[0],
) {
  await createNewIngredient(ingredient);
}
