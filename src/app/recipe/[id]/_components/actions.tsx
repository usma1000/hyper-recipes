"use server";

import { z } from "zod";
import {
  assignTagsToRecipe,
  removeAllTagsFromRecipe,
  createIngredientForRecipe,
  setPublishRecipe,
  updateRecipeNameAndDescription,
  saveStepsForRecipeId,
} from "~/server/queries";
import { AssignTagsFormSchema } from "./AssignTagsForm";

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
