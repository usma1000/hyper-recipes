"use server";

import { z } from "zod";
import {
  assignTagsToRecipe,
  removeAllTagsFromRecipe,
  createIngredientForRecipe,
  publishRecipe,
} from "~/server/queries";
import { AssignTagsFormSchema } from "./AssignTagsForm";
import { saveStepsForRecipeId } from "~/server/queries";

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

export async function onSaveSteps(recipeId: number, steps: any) {
  await saveStepsForRecipeId(recipeId, steps);
  return { success: true };
}

export async function onPublishRecipe(recipeId: number) {
  await publishRecipe(recipeId);
  return { success: true };
}
