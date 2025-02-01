'use server';

import { getAllRecipeNames } from '~/server/queries';

export async function fetchAllRecipeNames() {
  return await getAllRecipeNames();
}