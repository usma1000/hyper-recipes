"use server";

import type { z } from "zod";
import {
  assignTagsToRecipe,
  removeAllTagsFromRecipe,
  createIngredientForRecipe,
  setPublishRecipe,
  updateRecipeNameAndDescription,
  saveStepsForRecipeId,
  removeIngredientFromRecipe,
  updateRecipeHeroImage,
  getAllImages,
  getRecipeViewAsync,
} from "~/server/queries";
import type { Difficulty } from "~/server/db/schemas";
import type { AssignTagsFormSchema } from "./AssignTagsForm";
import type { RecipeViewDTO } from "./recipeViewTypes";

/**
 * Fetches a computed recipe view for the given difficulty and servings.
 * Used by the cook-facing adapt controls on the recipe page.
 * @param recipeId - Recipe ID
 * @param difficulty - Target difficulty level
 * @param servings - Desired servings count
 * @returns Serializable recipe view DTO
 */
export async function fetchRecipeView(
  recipeId: number,
  difficulty: Difficulty,
  servings: number,
): Promise<RecipeViewDTO> {
  const view = await getRecipeViewAsync(recipeId, difficulty, servings);

  return {
    recipeId: view.recipeId,
    difficulty: view.difficulty,
    servings: view.servings,
    ingredients: view.ingredients.map((ing) => ({
      id: ing.id,
      ingredientId: ing.ingredientId,
      ingredientName: ing.ingredientName,
      ingredientDescription: ing.ingredientDescription,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes,
      isOptional: ing.isOptional,
      substitutions: ing.substitutions.map((sub) => ({
        ingredientId: sub.ingredientId,
        ingredientName: sub.ingredientName,
        quantity: sub.quantity,
        unit: sub.unit,
        notes: sub.notes,
      })),
    })),
    steps: view.steps.map((step) => ({
      id: step.id,
      stepOrder: step.stepOrder,
      instruction: step.instruction,
      mediaUrl: step.mediaUrl,
      timerSeconds: step.timerSeconds,
    })),
  };
}

export async function onTagSubmit(
  recipeId: number,
  values: z.infer<typeof AssignTagsFormSchema>,
) {
  const tagIds = values.tags.map(Number);

  await removeAllTagsFromRecipe(recipeId);
  await assignTagsToRecipe(recipeId, tagIds);

  return { success: true };
}

export async function onIngredientSubmit(
  recipeId: number,
  ingredientId: number,
  quantity: string,
) {
  await createIngredientForRecipe(recipeId, ingredientId, quantity);
  return { success: true };
}

export async function onSaveSteps(recipeId: number, steps: string) {
  await saveStepsForRecipeId(recipeId, steps);
  return { success: true };
}

export async function onPublishRecipe(recipeId: number, publish: boolean) {
  await setPublishRecipe(recipeId, publish);
  return { success: true };
}

export async function onUpdateRecipeNameAndDescription(
  recipeId: number,
  name: string,
  description: string,
) {
  await updateRecipeNameAndDescription(recipeId, name, description);
  return { success: true };
}

export async function onRemoveIngredient(
  recipeId: number,
  ingredientId: number,
) {
  await removeIngredientFromRecipe(recipeId, ingredientId);
  return { success: true };
}

export async function updateRecipeImage(recipeId: number, imageId: number) {
  await updateRecipeHeroImage(recipeId, imageId);
  return { success: true };
}

export async function fetchAllImages() {
  return await getAllImages();
}
