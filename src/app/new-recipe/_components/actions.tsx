"use server";

import { z } from "zod";
import { createNewRecipe } from "~/server/queries";
import { CreateRecipeFormSchema } from "./CreateRecipeForm";

export async function onNewRecipeSubmit(
  recipe: z.infer<typeof CreateRecipeFormSchema>,
): Promise<{ success: boolean; id?: number }> {
  const newRecipe = await createNewRecipe(recipe);

  if (!newRecipe) {
    return { success: false };
  }

  return { success: true, id: newRecipe.id };
}
