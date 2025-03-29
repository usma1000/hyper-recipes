"use server";

import {
  getAllTagsByType,
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
