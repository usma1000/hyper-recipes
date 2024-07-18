"use server";

import { z } from "zod";
import { assignTagsToRecipe, removeAllTagsFromRecipe } from "~/server/queries";
import { AssignTagsFormSchema } from "./AssignTagsForm";

export async function onSubmit(
  recipeId: number,
  values: z.infer<typeof AssignTagsFormSchema>,
) {
  const tagIds = values.tags.map(Number);

  await removeAllTagsFromRecipe(recipeId);
  await assignTagsToRecipe(recipeId, tagIds);

  return { success: true };
}
