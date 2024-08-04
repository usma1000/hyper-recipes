"use server";

import { z } from "zod";
import { createNewRecipe } from "~/server/queries";
import { CreateRecipeFormSchema } from "./CreateRecipeForm";

export async function onNewRecipeSubmit(
  recipe: z.infer<typeof CreateRecipeFormSchema>,
  tagIds: number[],
  ingredients: { ingredientId: number; quantity: string }[],
) {
  await createNewRecipe(recipe, tagIds, ingredients);

  return { success: true };
}
