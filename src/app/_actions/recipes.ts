"use server";

import {
  getAllRecipeNames,
  getSliderRecipes,
  createNewRecipe,
  updateRecipeNameAndDescription,
  saveStepsForRecipeId,
  setPublishRecipe,
  updateRecipeHeroImage,
  getRecipe,
  getUnpublishedRecipes,
} from "~/server/queries";

export async function fetchAllRecipeNames() {
  return await getAllRecipeNames();
}

export async function fetchSliderRecipes() {
  return await getSliderRecipes();
}

export async function createRecipe(
  recipe: Parameters<typeof createNewRecipe>[0],
) {
  return await createNewRecipe(recipe);
}

export async function updateRecipe(
  id: number,
  name: string,
  description: string,
) {
  await updateRecipeNameAndDescription(id, name, description);
}

export async function saveSteps(id: number, steps: string) {
  await saveStepsForRecipeId(id, steps);
}

export async function publishRecipe(id: number, published: boolean) {
  await setPublishRecipe(id, published);
}

export async function updateHeroImage(recipeId: number, imageId: number) {
  return await updateRecipeHeroImage(recipeId, imageId);
}

export async function fetchRecipe(id: number) {
  return await getRecipe(id);
}

export async function fetchUnpublishedRecipes() {
  return await getUnpublishedRecipes();
}
