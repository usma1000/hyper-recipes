"use server";

import {
  upsertStepNote as upsertStepNoteQuery,
  upsertGeneralNote as upsertGeneralNoteQuery,
  getStepNotesForRecipe,
  getGeneralNoteForRecipe,
} from "~/server/queries/userNotes";

/**
 * Server action to save a step note.
 * @param recipeId - The recipe ID
 * @param stepIndex - The step index (0-based)
 * @param note - The note content (max 2000 chars)
 * @returns Success status and optional error message
 */
export async function saveStepNote(
  recipeId: number,
  stepIndex: number,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await upsertStepNoteQuery(recipeId, stepIndex, note);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save note";
    return { success: false, error: message };
  }
}

/**
 * Server action to save a general note for a recipe.
 * @param recipeId - The recipe ID
 * @param note - The note content (max 2000 chars)
 * @returns Success status and optional error message
 */
export async function saveGeneralNote(
  recipeId: number,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await upsertGeneralNoteQuery(recipeId, note);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save note";
    return { success: false, error: message };
  }
}

/**
 * Server action to fetch step notes for a recipe.
 * @param recipeId - The recipe ID
 * @returns Map of step index to note content
 */
export async function fetchStepNotes(
  recipeId: number
): Promise<Record<number, string>> {
  return await getStepNotesForRecipe(recipeId);
}

/**
 * Server action to fetch the general note for a recipe.
 * @param recipeId - The recipe ID
 * @returns The note content or empty string
 */
export async function fetchGeneralNote(recipeId: number): Promise<string> {
  return await getGeneralNoteForRecipe(recipeId);
}

