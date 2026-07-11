"use server";

import {
  getAllTagsByType,
  getPublishedRecipesByTagIdMap,
  getRecipesByTag,
  getAllTagsForRecipe,
  assignTagsToRecipe,
  removeAllTagsFromRecipe,
  createNewTag,
  deleteTag,
} from "~/server/queries/tags";

export async function fetchAllTagsByType() {
  return await getAllTagsByType();
}

export async function fetchRecipesByTag(tagId: number) {
  return await getRecipesByTag(tagId);
}

/**
 * Fetches all published recipes grouped by tag in one cached query.
 * Prefer this over N× fetchRecipesByTag on list pages.
 */
export async function fetchPublishedRecipesByTagIdMap(): Promise<
  Record<number, Recipe[]>
> {
  return await getPublishedRecipesByTagIdMap();
}

export async function fetchTagsForRecipe(recipeId: number) {
  return await getAllTagsForRecipe(recipeId);
}

export async function updateRecipeTags(recipeId: number, tagIds: number[]) {
  await removeAllTagsFromRecipe(recipeId);
  if (tagIds.length > 0) {
    await assignTagsToRecipe(recipeId, tagIds);
  }
}

export async function createTag(tag: Parameters<typeof createNewTag>[0]) {
  await createNewTag(tag);
}

export async function removeTag(tagId: number) {
  await deleteTag(tagId);
}
