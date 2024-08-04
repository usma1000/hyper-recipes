"use server";

import { z } from "zod";
import { createNewRecipe } from "~/server/queries";
import { CreateRecipeFormSchema } from "./CreateRecipeForm";

export async function onNewRecipeSubmit(
  recipe: z.infer<typeof CreateRecipeFormSchema>,
) {
  await createNewRecipe(recipe);

  return { success: true };
}
