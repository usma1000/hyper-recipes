"use server";

import {
  getMyCollections,
  getCollectionById,
  createCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
  deleteCollection,
} from "~/server/queries/collections";

export async function fetchMyCollections() {
  return await getMyCollections();
}

export async function fetchCollectionById(collectionId: number) {
  return await getCollectionById(collectionId);
}

export async function createNewCollection(
  title: string,
  description?: string,
) {
  return await createCollection({ title, description });
}

export async function addRecipeToCollectionAction(
  collectionId: number,
  recipeId: number,
) {
  return await addRecipeToCollection(collectionId, recipeId);
}

export async function removeRecipeFromCollectionAction(
  collectionId: number,
  recipeId: number,
) {
  return await removeRecipeFromCollection(collectionId, recipeId);
}

export async function deleteCollectionAction(collectionId: number) {
  return await deleteCollection(collectionId);
}

