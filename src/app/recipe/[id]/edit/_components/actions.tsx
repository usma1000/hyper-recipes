"use server";

// import { z } from "zod";

import { saveStepsForRecipeId } from "~/server/queries";

export async function onSaveSteps(recipeId: number, steps: any) {
  await saveStepsForRecipeId(recipeId, steps);
  return { success: true };
}
