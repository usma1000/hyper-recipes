"use server";

import { z } from "zod";
import { assignTagsToRecipe } from "~/server/queries";
import { AssignTagsFormSchema } from "./AssignTagsForm";

export async function onSubmit(
  recipeId: number,
  values: z.infer<typeof AssignTagsFormSchema>,
) {
  const tagIds = values.tags.map(Number);

  // TODO: tags that don't exist should be created,
  // tags missing from the list should be deleted

  await assignTagsToRecipe(recipeId, tagIds);

  return { success: true };
}
